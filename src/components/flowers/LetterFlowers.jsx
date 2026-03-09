import { useRef, useEffect } from 'react'

// Draws a collection of small decorative turtle-style flowers on a wide canvas
// Used as decoration around the letter section
export default function LetterFlowers({ width = 600, height = 160 }) {
  const canvasRef = useRef(null)
  const drawnRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || drawnRef.current) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const colors = [
      ['#F2B5D4', '#D4849B', '#e8a0c0'],
      ['#D4A853', '#C4917B', '#e6bc5e'],
      ['#A8C5A0', '#7BA376', '#D4E7D0'],
      ['#D4849B', '#C4917B', '#F2B5D4'],
      ['#C4917B', '#D4A853', '#F2B5D4'],
    ]

    function drawMiniRose(cx, cy, r, cols, rotation) {
      const k = 5
      for (let layer = 0; layer < 2; layer++) {
        ctx.beginPath()
        for (let i = 0; i <= 720; i++) {
          const theta = (i * Math.PI) / 180 + rotation
          const rr = (r - layer * r * 0.2) * Math.sin(k * theta)
          const x = cx + rr * Math.cos(theta + layer * 0.2)
          const y = cy + rr * Math.sin(theta + layer * 0.2)
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = cols[layer]
        ctx.lineWidth = 1.5 - layer * 0.3
        ctx.globalAlpha = 0.7 - layer * 0.15
        ctx.stroke()
        ctx.globalAlpha = 0.08
        ctx.fillStyle = cols[layer]
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#D4A853'
      ctx.fill()
    }

    function drawMiniLotus(cx, cy, r, cols) {
      for (let ring = 0; ring < 3; ring++) {
        const count = 5 + ring * 2
        const ringR = r * (0.25 + ring * 0.2)
        const petalLen = r * 0.2
        const petalW = r * 0.06

        for (let i = 0; i < count; i++) {
          const angle = (i * Math.PI * 2) / count + ring * 0.2

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(angle)

          ctx.beginPath()
          ctx.moveTo(0, -ringR * 0.2)
          ctx.bezierCurveTo(petalW, -ringR * 0.4, petalW * 1.3, -ringR - petalLen * 0.4, 0, -ringR - petalLen)
          ctx.bezierCurveTo(-petalW * 1.3, -ringR - petalLen * 0.4, -petalW, -ringR * 0.4, 0, -ringR * 0.2)
          ctx.closePath()

          ctx.fillStyle = cols[ring % cols.length] + 'aa'
          ctx.globalAlpha = 0.6
          ctx.fill()
          ctx.strokeStyle = cols[ring % cols.length]
          ctx.lineWidth = 0.6
          ctx.globalAlpha = 0.5
          ctx.stroke()
          ctx.restore()
        }
      }
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cx, cy, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#D4A853'
      ctx.fill()
    }

    function drawMiniSpirograph(cx, cy, maxR, cols) {
      const R = maxR * 0.5
      const r = maxR * 0.22
      const d = maxR * 0.3
      ctx.beginPath()
      for (let i = 0; i <= 1000; i++) {
        const t = (i * Math.PI * 2) / 200
        const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t)
        const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = cols[0]
      ctx.lineWidth = 1.2
      ctx.globalAlpha = 0.7
      ctx.stroke()
      ctx.globalAlpha = 0.06
      ctx.fillStyle = cols[1]
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function drawMiniSunburst(cx, cy, r, cols) {
      const count = 12
      for (let i = 0; i < count; i++) {
        const angle = (i * Math.PI * 2) / count
        const len = r * (0.5 + 0.3 * Math.sin(i * 1.7))
        const w = r * 0.15
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(w, len * 0.4, 0, len)
        ctx.quadraticCurveTo(-w, len * 0.4, 0, 0)
        ctx.fillStyle = cols[i % cols.length] + '99'
        ctx.globalAlpha = 0.5
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.08, 0, Math.PI * 2)
      ctx.fillStyle = '#D4A853'
      ctx.fill()
    }

    // Draw vine/stem connector
    function drawVine(x1, y1, x2, y2, seed) {
      ctx.beginPath()
      const cpx = (x1 + x2) / 2 + Math.sin(seed * 3.7) * 30
      const cpy = (y1 + y2) / 2 + Math.cos(seed * 2.3) * 15
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(cpx, cpy, x2, y2)
      ctx.strokeStyle = '#A8C5A0'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      ctx.stroke()
      ctx.globalAlpha = 1

      // Small leaf on vine
      const mx = (x1 + cpx) / 2
      const my = (y1 + cpy) / 2
      ctx.beginPath()
      ctx.ellipse(mx, my, 4, 7, Math.atan2(cpy - y1, cpx - x1), 0, Math.PI * 2)
      ctx.fillStyle = '#A8C5A0'
      ctx.globalAlpha = 0.25
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const startTime = performance.now()
    let frame

    const flowerPositions = [
      { x: width * 0.08, y: height * 0.4, r: 28, type: 0 },
      { x: width * 0.22, y: height * 0.25, r: 32, type: 1 },
      { x: width * 0.38, y: height * 0.55, r: 25, type: 2 },
      { x: width * 0.5, y: height * 0.3, r: 35, type: 3 },
      { x: width * 0.62, y: height * 0.6, r: 28, type: 0 },
      { x: width * 0.75, y: height * 0.35, r: 30, type: 1 },
      { x: width * 0.9, y: height * 0.5, r: 26, type: 2 },
    ]

    const drawFns = [drawMiniRose, drawMiniLotus, drawMiniSpirograph, drawMiniSunburst]

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / 3500, 1)
      ctx.clearRect(0, 0, width, height)

      const flowersToShow = Math.floor(progress * flowerPositions.length)

      // Draw vines connecting flowers
      for (let i = 1; i < flowersToShow; i++) {
        const prev = flowerPositions[i - 1]
        const curr = flowerPositions[i]
        drawVine(prev.x, prev.y, curr.x, curr.y, i)
      }

      // Draw flowers
      for (let i = 0; i < flowersToShow; i++) {
        const f = flowerPositions[i]
        const flowerProgress = Math.min((progress - i / flowerPositions.length) * flowerPositions.length, 1)
        if (flowerProgress <= 0) continue

        ctx.save()
        ctx.globalAlpha = flowerProgress
        drawFns[f.type](f.x, f.y, f.r * flowerProgress, colors[i % colors.length], i * 0.5)
        ctx.restore()
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        drawnRef.current = true
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="mx-auto"
    />
  )
}
