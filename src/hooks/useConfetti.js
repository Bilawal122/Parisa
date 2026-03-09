import confetti from 'canvas-confetti'

const COLORS = ['#F2B5D4', '#A8C5A0', '#D4A853', '#FDE2EF', '#C4917B', '#D4E7D0']

export function useConfetti() {
  const triggerConfetti = (options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 360,
      origin: { y: 0.4 },
      colors: COLORS,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ['circle', 'square'],
      ...options,
    }
    confetti(defaults)
  }

  const triggerCelebration = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: COLORS,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: COLORS,
      })
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const triggerFinale = () => {
    const bursts = [
      { particleCount: 80, spread: 360, origin: { x: 0.5, y: 0.3 }, startVelocity: 45 },
      { particleCount: 60, spread: 360, origin: { x: 0.2, y: 0.5 }, startVelocity: 35 },
      { particleCount: 60, spread: 360, origin: { x: 0.8, y: 0.5 }, startVelocity: 35 },
      { particleCount: 100, spread: 360, origin: { x: 0.5, y: 0.5 }, startVelocity: 50 },
      { particleCount: 40, spread: 360, origin: { x: 0.3, y: 0.3 }, startVelocity: 30 },
      { particleCount: 40, spread: 360, origin: { x: 0.7, y: 0.3 }, startVelocity: 30 },
    ]

    bursts.forEach((burst, i) => {
      setTimeout(() => {
        confetti({ ...burst, colors: COLORS, ticks: 300, gravity: 0.6, scalar: 1.3 })
      }, i * 250)
    })
  }

  return { triggerConfetti, triggerCelebration, triggerFinale }
}
