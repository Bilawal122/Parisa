import { useRef, useEffect } from 'react'

/*
  Each flower type draws a completely different mathematical pattern.
  Types:
    'spiral-rose'   – layered rose curves with gradient fills
    'fibonacci'     – fibonacci spiral with petal arcs
    'maurer'        – Maurer rose (straight lines connecting rose-curve points)
    'spirograph'    – hypotrochoid / spirograph pattern
    'sunburst'      – radial petal burst with gradient
    'lotus'         – concentric petal rings like a lotus from above
*/

function drawSpiralRose(ctx, cx, cy, maxR, progress, colors) {
  const steps = Math.floor(progress * 720)
  for (let layer = 0; layer < 3; layer++) {
    const r = maxR * (1 - layer * 0.15)
    const k = 5 + layer * 2
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, colors[layer % colors.length] + '40')
    grad.addColorStop(1, colors[layer % colors.length] + '10')

    ctx.beginPath()
    for (let i = 0; i <= steps; i++) {
      const theta = (i * Math.PI) / 180
      const rr = r * Math.sin(k * theta)
      const x = cx + rr * Math.cos(theta + layer * 0.3)
      const y = cy + rr * Math.sin(theta + layer * 0.3)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = colors[layer % colors.length]
    ctx.lineWidth = 2 - layer * 0.4
    ctx.globalAlpha = 0.85 - layer * 0.15
    ctx.stroke()
    if (progress > 0.6) {
      ctx.globalAlpha = 0.12
      ctx.fillStyle = grad
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function drawMaurer(ctx, cx, cy, maxR, progress, colors) {
  const n = 6
  const d = 71
  const steps = Math.floor(progress * 360)

  // Maurer lines
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const k = i * d * (Math.PI / 180)
    const r = maxR * Math.sin(n * k)
    const x = cx + r * Math.cos(k)
    const y = cy + r * Math.sin(k)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.strokeStyle = colors[0] + '50'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Rose curve on top
  ctx.beginPath()
  for (let i = 0; i <= steps * 2; i++) {
    const theta = (i * Math.PI) / 180
    const r = maxR * Math.sin(n * theta)
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.strokeStyle = colors[1]
  ctx.lineWidth = 1.8
  ctx.stroke()

  if (progress > 0.5) {
    ctx.globalAlpha = 0.1
    ctx.fillStyle = colors[2]
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function drawSpirograph(ctx, cx, cy, maxR, progress, colors) {
  const R = maxR * 0.55
  const r = maxR * 0.25
  const d = maxR * 0.35
  const steps = Math.floor(progress * 1000)

  for (let layer = 0; layer < 2; layer++) {
    const offset = layer * Math.PI * 0.25
    const rr = r * (1 + layer * 0.3)
    ctx.beginPath()
    for (let i = 0; i <= steps; i++) {
      const t = (i * Math.PI * 2) / 200 + offset
      const x = cx + (R - rr) * Math.cos(t) + d * Math.cos(((R - rr) / rr) * t)
      const y = cy + (R - rr) * Math.sin(t) - d * Math.sin(((R - rr) / rr) * t)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = colors[layer]
    ctx.lineWidth = 1.8 - layer * 0.4
    ctx.globalAlpha = 0.8
    ctx.stroke()

    if (progress > 0.7) {
      ctx.globalAlpha = 0.08
      ctx.fillStyle = colors[layer]
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function drawSunburst(ctx, cx, cy, maxR, progress, colors) {
  const petalCount = 16
  const stepsPerPetal = Math.floor(progress * petalCount)

  for (let i = 0; i < stepsPerPetal; i++) {
    const angle = (i * Math.PI * 2) / petalCount
    const len = maxR * (0.6 + 0.4 * Math.sin(i * 1.5))
    const width = maxR * 0.18

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)

    // Petal shape
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(width, len * 0.4, 0, len)
    ctx.quadraticCurveTo(-width, len * 0.4, 0, 0)
    ctx.closePath()

    const grad = ctx.createLinearGradient(0, 0, 0, len)
    grad.addColorStop(0, colors[i % colors.length] + 'cc')
    grad.addColorStop(1, colors[i % colors.length] + '30')
    ctx.fillStyle = grad
    ctx.globalAlpha = 0.6
    ctx.fill()
    ctx.strokeStyle = colors[i % colors.length]
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.8
    ctx.stroke()

    ctx.restore()
  }
  ctx.globalAlpha = 1

  // Center
  if (progress > 0.5) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.12)
    grad.addColorStop(0, '#D4A853')
    grad.addColorStop(1, '#D4A853' + '40')
    ctx.beginPath()
    ctx.arc(cx, cy, maxR * 0.12, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  }
}

function drawLotus(ctx, cx, cy, maxR, progress, colors) {
  const rings = 4
  const ringsDrawn = Math.floor(progress * (rings + 1))

  for (let ring = 0; ring < Math.min(ringsDrawn, rings); ring++) {
    const petalCount = 6 + ring * 3
    const ringR = maxR * (0.3 + ring * 0.2)
    const petalLen = maxR * (0.25 + ring * 0.06)
    const petalW = maxR * (0.08 + ring * 0.02)

    for (let i = 0; i < petalCount; i++) {
      const angle = (i * Math.PI * 2) / petalCount + ring * 0.15

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)

      ctx.beginPath()
      ctx.moveTo(0, -ringR * 0.3)
      ctx.bezierCurveTo(petalW, -ringR * 0.5, petalW * 1.5, -ringR - petalLen * 0.5, 0, -ringR - petalLen)
      ctx.bezierCurveTo(-petalW * 1.5, -ringR - petalLen * 0.5, -petalW, -ringR * 0.5, 0, -ringR * 0.3)
      ctx.closePath()

      ctx.fillStyle = colors[ring % colors.length] + (ring === 0 ? 'dd' : 'aa')
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.strokeStyle = colors[ring % colors.length]
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.6
      ctx.stroke()

      ctx.restore()
    }
  }

  ctx.globalAlpha = 1
  if (progress > 0.3) {
    ctx.beginPath()
    ctx.arc(cx, cy, maxR * 0.1, 0, Math.PI * 2)
    ctx.fillStyle = '#D4A853'
    ctx.fill()
  }
}

function drawFibonacci(ctx, cx, cy, maxR, progress, colors) {
  const phi = (1 + Math.sqrt(5)) / 2
  const count = Math.floor(progress * 200)

  for (let i = 0; i < count; i++) {
    const angle = i * phi * Math.PI * 2
    const r = Math.sqrt(i) * maxR * 0.065
    if (r > maxR) continue
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    const dotR = 2 + (i / 200) * 4

    ctx.beginPath()
    ctx.arc(x, y, dotR, 0, Math.PI * 2)
    ctx.fillStyle = colors[i % colors.length]
    ctx.globalAlpha = 0.7 - (r / maxR) * 0.3
    ctx.fill()
  }

  // Connecting spiral lines
  if (progress > 0.3) {
    for (let s = 0; s < 3; s++) {
      ctx.beginPath()
      const spiralSteps = Math.floor((progress - 0.3) / 0.7 * 300)
      for (let i = 0; i < spiralSteps; i++) {
        const angle = i * 0.1 + s * (Math.PI * 2 / 3)
        const r = i * maxR * 0.003
        if (r > maxR) break
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = colors[s % colors.length] + '60'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.5
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

const DRAW_FNS = {
  'spiral-rose': drawSpiralRose,
  'maurer': drawMaurer,
  'spirograph': drawSpirograph,
  'sunburst': drawSunburst,
  'lotus': drawLotus,
  'fibonacci': drawFibonacci,
}

export default function TurtleFlower({
  type = 'spiral-rose',
  size = 200,
  colors = ['#F2B5D4', '#D4849B', '#C4917B'],
  label = '',
  delay = 0
}) {
  const canvasRef = useRef(null)
  const drawnRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || drawnRef.current) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = size * 0.42

    let frame = 0
    const startTime = performance.now() + delay * 1000
    const drawFn = DRAW_FNS[type] || drawSpiralRose

    function animate(now) {
      if (now < startTime) {
        frame = requestAnimationFrame(animate)
        return
      }
      const elapsed = now - startTime
      const progress = Math.min(elapsed / 3000, 1)
      ctx.clearRect(0, 0, size, size)
      drawFn(ctx, cx, cy, maxR, progress, colors)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        drawnRef.current = true
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [size, type, colors, delay])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
      />
      {label && (
        <p className="font-script text-base sm:text-lg text-charcoal/80 mt-1 text-center whitespace-pre-line">
          {label}
        </p>
      )}
    </div>
  )
}
