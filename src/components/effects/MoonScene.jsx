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

    // Seeded pseudo-random (deterministic)
    const sr = (seed) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    // --- Pre-generate data ---
    const stars = Array.from({ length: 200 }, (_, i) => ({
      x: sr(i * 3.1) * width,
      y: sr(i * 7.3) * height,
      r: 0.3 + sr(i * 13.7) * 1.8,
      b: 0.2 + sr(i * 19.1) * 0.8,
      s: 0.5 + sr(i * 23.3) * 2,
    }))

    const moonCx = width * 0.5
    const moonCy = height * 0.35
    const moonR = Math.min(width, height) * 0.2

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

    function draw(now) {
      const elapsed = now - startTime
      const p = Math.min(elapsed / 5000, 1)
      ctx.clearRect(0, 0, width, height)

      // === Stars ===
      stars.forEach((star, i) => {
        if (i / stars.length > p * 1.3) return
        const twinkle = 0.5 + 0.5 * Math.sin(now * star.s * 0.001 + i)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,248,230,${star.b * twinkle})`
        ctx.fill()
      })

      // === Moonbeams (subtle light rays) ===
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
          grad.addColorStop(0, `rgba(245,235,210,${0.035 * beamP})`)
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

      // === Moon Glow + Body ===
      const mp = Math.min(Math.max(0, (p - 0.08) / 0.5), 1)
      if (mp > 0) {
        const mr = moonR * mp

        // Corona glow
        const glow = ctx.createRadialGradient(moonCx, moonCy, mr * 0.9, moonCx, moonCy, mr * 1.8)
        glow.addColorStop(0, `rgba(245,235,210,${0.22 * mp})`)
        glow.addColorStop(0.5, `rgba(245,235,210,${0.07 * mp})`)
        glow.addColorStop(1, 'rgba(245,235,210,0)')
        ctx.beginPath()
        ctx.arc(moonCx, moonCy, mr * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Moon body (clipped)
        ctx.save()
        ctx.beginPath()
        ctx.arc(moonCx, moonCy, mr, 0, Math.PI * 2)
        ctx.clip()

        // Base gradient
        const mGrad = ctx.createRadialGradient(
          moonCx - mr * 0.2, moonCy - mr * 0.2, 0,
          moonCx, moonCy, mr
        )
        mGrad.addColorStop(0, '#F5F0E8')
        mGrad.addColorStop(0.5, '#E8E2D6')
        mGrad.addColorStop(1, '#C4BEB2')
        ctx.beginPath()
        ctx.arc(moonCx, moonCy, mr, 0, Math.PI * 2)
        ctx.fillStyle = mGrad
        ctx.fill()

        // Maria (dark lunar seas)
        const maria = [
          { x: -0.1, y: -0.15, rx: 0.22, ry: 0.18 },
          { x: 0.12, y: 0.12, rx: 0.18, ry: 0.14 },
          { x: -0.22, y: 0.22, rx: 0.13, ry: 0.16 },
        ]
        maria.forEach(m => {
          ctx.beginPath()
          ctx.ellipse(
            moonCx + m.x * mr, moonCy + m.y * mr,
            m.rx * mr, m.ry * mr, 0.3, 0, Math.PI * 2
          )
          ctx.fillStyle = 'rgba(170,162,148,0.25)'
          ctx.fill()
        })

        // Craters
        const craterP = Math.min(Math.max(0, (mp - 0.4) / 0.4), 1)
        craters.forEach((c, i) => {
          if (i / craters.length > craterP) return
          const cx2 = moonCx + c.x * mr
          const cy2 = moonCy + c.y * mr
          const cr = c.r * mr
          // Shadow
          ctx.beginPath()
          ctx.arc(cx2 + cr * 0.08, cy2 + cr * 0.08, cr, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(145,138,125,0.22)'
          ctx.fill()
          // Body
          ctx.beginPath()
          ctx.arc(cx2, cy2, cr * 0.85, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(180,172,158,0.25)'
          ctx.fill()
          // Highlight
          ctx.beginPath()
          ctx.arc(cx2 - cr * 0.1, cy2 - cr * 0.1, cr * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,250,240,0.08)'
          ctx.fill()
        })

        ctx.restore() // moon clip

        // Rim highlight
        ctx.beginPath()
        ctx.arc(moonCx, moonCy, mr, -0.9, 0.9)
        ctx.strokeStyle = 'rgba(255,250,240,0.15)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // === Decorative Crescents ===
      crescents.forEach((c, i) => {
        const cp = Math.max(0, (p - 0.25 - i * 0.035) * 3)
        if (cp <= 0) return
        const cx2 = width * c.x
        const cy2 = height * c.y
        const cr = c.r

        ctx.save()
        ctx.translate(cx2, cy2)
        ctx.rotate(c.rot)

        // Glow
        ctx.globalAlpha = Math.min(cp, 0.5)
        const tg = ctx.createRadialGradient(0, 0, cr * 0.5, 0, 0, cr * 2.5)
        tg.addColorStop(0, 'rgba(245,235,210,0.12)')
        tg.addColorStop(1, 'rgba(245,235,210,0)')
        ctx.beginPath()
        ctx.arc(0, 0, cr * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = tg
        ctx.fill()
        ctx.globalAlpha = 1

        // Crescent shape (clip + destination-out)
        ctx.save()
        ctx.beginPath()
        ctx.arc(0, 0, cr, 0, Math.PI * 2)
        ctx.clip()

        ctx.globalAlpha = Math.min(cp, 0.7)
        ctx.beginPath()
        ctx.arc(0, 0, cr, 0, Math.PI * 2)
        ctx.fillStyle = '#EDE5D5'
        ctx.fill()

        ctx.globalCompositeOperation = 'destination-out'
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(cr * 0.4, 0, cr * 0.82, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore() // clip + composite
        ctx.restore() // translate + rotate
      })

      // === Moon Phases Row ===
      const pp = Math.max(0, (p - 0.5) / 0.5)
      if (pp > 0) {
        const pr = Math.min(width * 0.022, 10)
        const spacing = Math.min(width * 0.065, 38)
        const count = 8
        const totalW = (count - 1) * spacing
        const sx = width / 2 - totalW / 2
        const py = height * 0.85
        const offsets = [0, -0.55, -1.1, -1.65, null, 1.65, 1.1, 0.55]

        for (let i = 0; i < count; i++) {
          const ip = Math.min(Math.max(0, (pp - i / count * 0.6) * 3), 1)
          if (ip <= 0) continue
          const px = sx + i * spacing

          ctx.save()
          ctx.globalAlpha = ip * 0.75

          // Clip to phase circle
          ctx.save()
          ctx.beginPath()
          ctx.arc(px, py, pr, 0, Math.PI * 2)
          ctx.clip()

          // Lit base
          ctx.beginPath()
          ctx.arc(px, py, pr, 0, Math.PI * 2)
          ctx.fillStyle = '#E0D8C8'
          ctx.fill()

          // Shadow
          if (offsets[i] !== null) {
            ctx.globalCompositeOperation = 'destination-out'
            ctx.globalAlpha = 1
            ctx.beginPath()
            ctx.arc(px + offsets[i] * pr, py, pr * 1.02, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore() // clip + composite

          // Border
          ctx.beginPath()
          ctx.arc(px, py, pr, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(200,195,180,0.15)'
          ctx.lineWidth = 0.5
          ctx.stroke()

          ctx.globalAlpha = 1
          ctx.restore()
        }

        // Phase labels
        if (pp > 0.8) {
          ctx.globalAlpha = (pp - 0.8) / 0.2 * 0.4
          ctx.font = `${Math.min(width * 0.018, 9)}px Inter, sans-serif`
          ctx.fillStyle = '#B8B0A0'
          ctx.textAlign = 'center'
          const labels = ['new', '', 'first\nqtr', '', 'full', '', 'last\nqtr', '']
          labels.forEach((label, i) => {
            if (!label) return
            const px2 = sx + i * spacing
            ctx.fillText(label, px2, py + pr + 12)
          })
          ctx.globalAlpha = 1
        }
      }

      // === Shooting Stars ===
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
