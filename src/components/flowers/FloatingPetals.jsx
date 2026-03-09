import { useMemo } from 'react'

export default function FloatingPetals() {
  const petals = useMemo(() => {
    const count = window.innerWidth < 640 ? 10 : 18
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 12 + Math.random() * 12,
      size: 8 + Math.random() * 14,
      rotation: Math.random() * 360,
      opacity: 0.25 + Math.random() * 0.35,
      alt: Math.random() > 0.5,
      color: ['#F2B5D4', '#FDE2EF', '#D4849B', '#C4917B'][Math.floor(Math.random() * 4)],
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map(petal => (
        <div
          key={petal.id}
          className={petal.alt ? 'petal-float-alt' : 'petal-float'}
          style={{
            position: 'absolute',
            left: `${petal.left}%`,
            top: '-20px',
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            style={{ opacity: petal.opacity }}
          >
            <ellipse
              cx="10"
              cy="10"
              rx="10"
              ry="6"
              fill={petal.color}
              transform={`rotate(${petal.rotation} 10 10)`}
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
