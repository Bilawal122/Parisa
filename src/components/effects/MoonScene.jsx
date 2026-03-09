import { useRef, useEffect } from 'react'

export default function MoonScene({ width = 500, height = 550 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Seeded pseudo-random
    const sr = (seed) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    // === Pre-generate data ===
    const moonCx = width * 0.5
    const moonCy = height * 0.35
    const moonR = Math.min(width, height) * 0.19

    // Stars - mix of dots and sparkles
    const stars = Array.from({ length: 180 }, (_, i) => ({
      x: sr(i * 3.1) * width,
      y: sr(i * 7.3) * height,
      size: 0.8 + sr(i * 13.7) * 2.5,
      b: 0.2 + sr(i * 19.1) * 0.8,
      s: 0.5 + sr(i * 23.3) * 2,
      sparkle: sr(i * 29.9) > 0.7,
    }))

    // Stipple dots for moon surface texture
    const stippleCount = Math.floor(moonR * moonR * 0.1)
    const stipples = Array.from({ length: stippleCount }, (_, i) => {
      const angle = sr(i * 7.1) * Math.PI * 2
      const dist = Math.sqrt(sr(i * 13.3)) // sqrt for uniform distribution
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        r: 0.4 + sr(i * 23.7) * 1.3,
        a: 0.02 + sr(i * 31.1) * 0.06,
      }
    })

    const craters = [
      { x: 0.15, y: -0.22, r: 0.11 },
      { x: -0.28, y: 0.08, r: 0.08 },
      { x: 0.32, y: 0.28, r: 0.13 },
      { x: -0.12, y: -0.38, r: 0.06 },
      { x: 0.05, y: 0.38, r: 0.09 },
      { x: -0.38, y: -0.12, r: 0.055 },
      { x: 0.22, y: -0.08, r: 0.075 },
      { x: -0.18, y: 0.28, r: 0.1 },
    ]

    const crescents = [
      { x: 0.08, y: 0.12, r: 14, rot: 0.4 },
      { x: 0.92, y: 0.1, r: 16, rot: -0.6 },
      { x: 0.05, y: 0.55, r: 11, rot: 1.1 },
      { x: 0.95, y: 0.48, r: 13, rot: -0.9 },
      { x: 0.82, y: 0.68, r: 9, rot: 0.7 },
      { x: 0.14, y: 0.72, r: 12, rot: -1.1 },
      { x: 0.52, y: 0.05, r: 9, rot: 0.2 },
      { x: 0.3, y: 0.63, r: 10, rot: -0.4 },
      { x: 0.7, y: 0.6, r: 8, rot: 1.5 },
      { x: 0.4, y: 0.8, r: 7, rot: 0.9 },
      { x: 0.6, y: 0.75, r: 11, rot: -0.3 },
    ]

    const startTime = performance.now()

    // --- Drawing helpers ---

    // Draw a 4-pointed sparkle star
    function drawSparkle(x, y, size, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = alpha
      ctx.strokeStyle = '#FFF8E6'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(0, size)
      ctx.moveTo(-size, 0)
      ctx.lineTo(size, 0)
      const ds = size * 0.55
      ctx.moveTo(-ds, -ds)
      ctx.lineTo(ds, ds)
      ctx.moveTo(ds, -ds)
      ctx.lineTo(-ds, ds)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF8E6'
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
    }

    // Draw Maurer rose halo (mathematical art pattern)
    function drawRoseHalo(progress, now) {
      if (progress <= 0) return
      const haloR = moonR * 1.7
      ctx.save()
      ctx.translate(moonCx, moonCy)
      ctx.rotate(now * 0.00002)

      // Layer 1: Maurer rose n=6, d=71
      ctx.globalAlpha = 0.07 * Math.min(progress * 2, 1)
      ctx.strokeStyle = '#F0E8D8'
      ctx.lineWidth = 0.6
      ctx.beginPath()
      const maxPts = Math.floor(361 * progress)
      for (let i = 0; i <= maxPts; i++) {
        const k = i * 71 * Math.PI / 180
        const r = haloR * Math.sin(6 * k)
        const x = r * Math.cos(k)
        const y = r * Math.sin(k)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Layer 2: Complementary rose n=4, d=47
      ctx.globalAlpha = 0.04 * Math.min(progress * 2, 1)
      ctx.strokeStyle = '#F2B5D4'
      ctx.lineWidth = 0.4
      ctx.beginPath()
      for (let i = 0; i <= maxPts; i++) {
        const k = i * 47 * Math.PI / 180
        const r = haloR * 0.85 * Math.sin(4 * k)
        const x = r * Math.cos(k)
        const y = r * Math.sin(k)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Layer 3: Spirograph ring
      ctx.globalAlpha = 0.035 * Math.min(progress * 2, 1)
      ctx.strokeStyle = '#D4A853'
      ctx.lineWidth = 0.3
      const R2 = haloR * 0.7
      const r2 = haloR * 0.25
      const d2 = haloR * 0.35
      ctx.beginPath()
      for (let i = 0; i <= maxPts; i++) {
        const t = (i / 361) * Math.PI * 12
        const x = (R2 - r2) * Math.cos(t) + d2 * Math.cos((R2 - r2) / r2 * t)
        const y = (R2 - r2) * Math.sin(t) - d2 * Math.sin((R2 - r2) / r2 * t)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.restore()
    }

    // Draw the main moon body with stippled texture
    function drawMoon(progress) {
      if (progress <= 0) return
      const r = moonR * Math.min(progress, 1)

      // Multi-layer soft glow
      for (let i = 5; i > 0; i--) {
        const gr = r * (1 + i * 0.15)
        ctx.beginPath()
        ctx.arc(moonCx, moonCy, gr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,235,210,${0.016 * (6 - i) * Math.min(progress * 2, 1)})`
        ctx.fill()
      }

      // Moon body (clipped)
      ctx.save()
      ctx.beginPath()
      ctx.arc(moonCx, moonCy, r, 0, Math.PI * 2)
      ctx.clip()

      // Base gradient
      const grad = ctx.createRadialGradient(
        moonCx - r * 0.15, moonCy - r * 0.15, 0,
        moonCx, moonCy, r
      )
      grad.addColorStop(0, '#F0EBE0')
      grad.addColorStop(0.5, '#E0D8CC')
      grad.addColorStop(1, '#C0B8A8')
      ctx.beginPath()
      ctx.arc(moonCx, moonCy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Stippled surface texture (pointillist effect)
      const visStipples = Math.floor(stipples.length * Math.min(progress * 1.5, 1))
      for (let i = 0; i < visStipples; i++) {
        const s = stipples[i]
        const dx = moonCx + s.dx * r
        const dy = moonCy + s.dy * r
        ctx.beginPath()
        ctx.arc(dx, dy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(155,148,135,${s.a})`
        ctx.fill()
      }

      // Maria (dark lunar seas)
      ;[
        { x: -0.1, y: -0.15, rx: 0.22, ry: 0.18 },
        { x: 0.12, y: 0.12, rx: 0.18, ry: 0.14 },
        { x: -0.22, y: 0.22, rx: 0.13, ry: 0.16 },
      ].forEach(m => {
        ctx.beginPath()
        ctx.ellipse(moonCx + m.x * r, moonCy + m.y * r, m.rx * r, m.ry * r, 0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(160,152,138,0.2)'
        ctx.fill()
      })

      // Craters as concentric ring patterns (turtle-style)
      const craterP = Math.min(Math.max(0, (progress - 0.4) / 0.4), 1)
      craters.forEach((c, i) => {
        if (i / craters.length > craterP) return
        const crX = moonCx + c.x * r
        const crY = moonCy + c.y * r
        const crR = c.r * r

        // Concentric rings (like turtle drawing circles)
        for (let ring = 5; ring > 0; ring--) {
          ctx.beginPath()
          ctx.arc(crX, crY, crR * (ring / 5), 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(140,132,118,${0.05 * ring})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        // Cross-hatch inside crater
        ctx.save()
        ctx.beginPath()
        ctx.arc(crX, crY, crR * 0.7, 0, Math.PI * 2)
        ctx.clip()
        ctx.strokeStyle = 'rgba(140,132,118,0.06)'
        ctx.lineWidth = 0.3
        for (let l = -3; l <= 3; l++) {
          ctx.beginPath()
          ctx.moveTo(crX + l * crR * 0.25, crY - crR)
          ctx.lineTo(crX + l * crR * 0.25, crY + crR)
          ctx.stroke()
        }
        ctx.restore()

        // Rim highlight
        ctx.beginPath()
        ctx.arc(crX - crR * 0.08, crY - crR * 0.08, crR * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,250,240,0.05)'
        ctx.fill()
      })

      ctx.restore() // moon clip

      // Delicate outline
      ctx.beginPath()
      ctx.arc(moonCx, moonCy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(220,215,200,0.15)'
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    // Draw artistic crescent with filigree detail
    function drawCrescent(cx2, cy2, r, rot, progress) {
      if (progress <= 0) return
      ctx.save()
      ctx.translate(cx2, cy2)
      ctx.rotate(rot)

      // Glow
      ctx.globalAlpha = Math.min(progress, 0.45)
      const tg = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.5)
      tg.addColorStop(0, 'rgba(245,235,210,0.1)')
      tg.addColorStop(1, 'rgba(245,235,210,0)')
      ctx.beginPath()
      ctx.arc(0, 0, r * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = tg
      ctx.fill()
      ctx.globalAlpha = 1

      // Crescent with clip + destination-out
      ctx.save()
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.clip()

      ctx.globalAlpha = Math.min(progress, 0.7)
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fillStyle = '#EDE5D5'
      ctx.fill()

      // Inner filigree rings (turtle-style concentric circles)
      ctx.strokeStyle = 'rgba(200,195,180,0.25)'
      ctx.lineWidth = 0.3
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath()
        ctx.arc(-r * 0.12, 0, r * ring * 0.22, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Tiny cross-hatch detail
      ctx.strokeStyle = 'rgba(200,195,180,0.12)'
      ctx.lineWidth = 0.2
      for (let l = -2; l <= 2; l++) {
        ctx.beginPath()
        ctx.moveTo(l * r * 0.2, -r)
        ctx.lineTo(l * r * 0.2, r)
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(r * 0.4, 0, r * 0.82, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore() // clip + composite

      // Outer decorative arc
      ctx.globalAlpha = Math.min(progress, 0.2)
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.15, -1.2, 1.2)
      ctx.strokeStyle = '#EDE5D5'
      ctx.lineWidth = 0.4
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.restore() // translate + rotate
    }

    // Draw moon phases row
    function drawPhases(progress) {
      if (progress <= 0) return
      const pr = Math.min(width * 0.022, 10)
      const spacing = Math.min(width * 0.065, 38)
      const count = 8
      const totalW = (count - 1) * spacing
      const sx = width / 2 - totalW / 2
      const py = height * 0.85
      const offsets = [0, -0.55, -1.1, -1.65, null, 1.65, 1.1, 0.55]

      for (let i = 0; i < count; i++) {
        const ip = Math.min(Math.max(0, (progress - i / count * 0.6) * 3), 1)
        if (ip <= 0) continue
        const px = sx + i * spacing

        ctx.save()
        ctx.globalAlpha = ip * 0.75

        ctx.save()
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.clip()

        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fillStyle = '#E0D8C8'
        ctx.fill()

        // Mini stipple dots
        for (let d = 0; d < 6; d++) {
          const ang = sr(i * 10 + d * 7.1) * Math.PI * 2
          const dist = sr(i * 10 + d * 13.3) * pr * 0.7
          ctx.beginPath()
          ctx.arc(px + Math.cos(ang) * dist, py + Math.sin(ang) * dist, 0.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(150,142,128,0.2)'
          ctx.fill()
        }

        if (offsets[i] !== null) {
          ctx.globalCompositeOperation = 'destination-out'
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.arc(px + offsets[i] * pr, py, pr * 1.02, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(200,195,180,0.15)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        ctx.globalAlpha = 1
        ctx.restore()
      }

      // Labels
      if (progress > 0.8) {
        ctx.globalAlpha = (progress - 0.8) / 0.2 * 0.4
        ctx.font = `${Math.min(width * 0.018, 9)}px Inter, sans-serif`
        ctx.fillStyle = '#B8B0A0'
        ctx.textAlign = 'center'
        ;['new', '', 'first\nqtr', '', 'full', '', 'last\nqtr', ''].forEach((label, i) => {
          if (!label) return
          ctx.fillText(label, sx + i * spacing, py + pr + 12)
        })
        ctx.globalAlpha = 1
      }
    }

    // === Main draw loop ===
    function draw(now) {
      const elapsed = now - startTime
      const p = Math.min(elapsed / 5000, 1)
      ctx.clearRect(0, 0, width, height)

      // Stars
      stars.forEach((star, i) => {
        if (i / stars.length > p * 1.3) return
        const twinkle = 0.5 + 0.5 * Math.sin(now * star.s * 0.001 + i)
        const alpha = star.b * twinkle
        if (star.sparkle) {
          drawSparkle(star.x, star.y, star.size, alpha)
        } else {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.35, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,248,230,${alpha})`
          ctx.fill()
        }
      })

      // Moonbeams
      const beamP = Math.min(Math.max(0, (p - 0.15) / 0.5), 1)
      if (beamP > 0) {
        const beamRot = now * 0.00003
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2 + beamRot
          const len = moonR * (1.5 + sr(i * 31) * 1.5)
          const bw = 2 + sr(i * 37) * 2.5
          ctx.save()
          ctx.translate(moonCx, moonCy)
          ctx.rotate(angle)
          const grad = ctx.createLinearGradient(0, -moonR * 1.05, 0, -moonR - len * beamP)
          grad.addColorStop(0, `rgba(245,235,210,${0.03 * beamP})`)
          grad.addColorStop(1, 'rgba(245,235,210,0)')
          ctx.beginPath()
          ctx.moveTo(-bw / 2, -moonR * 1.05)
          ctx.lineTo(0, -moonR - len * beamP)
          ctx.lineTo(bw / 2, -moonR * 1.05)
          ctx.closePath()
          ctx.fillStyle = grad
          ctx.fill()
          ctx.restore()
        }
      }

      // Rose curve halo (behind moon body)
      const haloP = Math.min(Math.max(0, (p - 0.2) / 0.6), 1)
      drawRoseHalo(haloP, now)

      // Main moon
      const mp = Math.min(Math.max(0, (p - 0.08) / 0.5), 1)
      drawMoon(mp)

      // Decorative crescents
      crescents.forEach((c, i) => {
        const cp = Math.max(0, (p - 0.25 - i * 0.035) * 3)
        if (cp <= 0) return
        drawCrescent(width * c.x, height * c.y, c.r, c.rot, Math.min(cp, 1))
      })

      // Moon phases
      drawPhases(Math.max(0, (p - 0.5) / 0.5))

      // Shooting stars
      ;[0.3, 0.6, 0.82].forEach((t, i) => {
        const sp = (p - t) / 0.08
        if (sp < 0 || sp > 1) return
        const sx2 = width * (0.12 + sr(i * 47) * 0.4)
        const sy2 = height * (0.04 + sr(i * 53) * 0.15)
        const ex = sx2 + width * 0.2
        const ey = sy2 + height * 0.13
        const cx2 = sx2 + (ex - sx2) * sp
        const cy2 = sy2 + (ey - sy2) * sp
        const fade = 1 - sp * 0.5
        const tx = cx2 - (ex - sx2) * 0.3 * (1 - sp)
        const ty = cy2 - (ey - sy2) * 0.3 * (1 - sp)
        const grad = ctx.createLinearGradient(tx, ty, cx2, cy2)
        grad.addColorStop(0, 'rgba(255,248,230,0)')
        grad.addColorStop(1, `rgba(255,248,230,${0.7 * fade})`)
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(cx2, cy2)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(cx2, cy2, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,248,230,${0.9 * fade})`
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="mx-auto"
    />
  )
}
