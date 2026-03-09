export default function Sunflower({ size = 120 }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 120 216" fill="none">
      {/* Stem */}
      <line x1="60" y1="110" x2="60" y2="210" stroke="#7BA376" strokeWidth="4" className="stem-grow" />

      {/* Big leaves */}
      <g className="leaf" style={{ transformOrigin: '50px 155px' }}>
        <path d="M58 155 Q30 135 22 150 Q30 170 55 160" fill="#7BA376" />
      </g>
      <g className="leaf" style={{ transformOrigin: '70px 175px', animationDelay: '0.4s' }}>
        <path d="M62 175 Q90 155 98 170 Q90 190 65 180" fill="#7BA376" />
      </g>

      {/* Outer petals */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i * 360) / 14
        return (
          <ellipse
            key={`outer-${i}`}
            className="petal"
            cx="60"
            cy="48"
            rx="7"
            ry="22"
            fill="#D4A853"
            opacity="0.9"
            transform={`rotate(${angle} 60 75)`}
            style={{ animationDelay: `${0.8 + i * 0.07}s` }}
          />
        )
      })}

      {/* Inner petals */}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i * 360) / 10 + 18
        return (
          <ellipse
            key={`inner-${i}`}
            className="petal"
            cx="60"
            cy="56"
            rx="5"
            ry="15"
            fill="#e6bc5e"
            opacity="0.85"
            transform={`rotate(${angle} 60 75)`}
            style={{ animationDelay: `${1.3 + i * 0.06}s` }}
          />
        )
      })}

      {/* Center */}
      <circle className="petal" cx="60" cy="75" r="16" fill="#8B5E3C" style={{ animationDelay: '1.9s' }} />
      <circle className="petal" cx="60" cy="75" r="10" fill="#6B4226" style={{ animationDelay: '2.0s' }} />
    </svg>
  )
}
