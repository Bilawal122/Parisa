export default function Rose({ color = '#F2B5D4', size = 120 }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 120 216" fill="none">
      {/* Stem */}
      <line x1="60" y1="100" x2="60" y2="210" stroke="#7BA376" strokeWidth="3" className="stem-grow" />

      {/* Left leaf */}
      <g className="leaf" style={{ transformOrigin: '52px 155px' }}>
        <path d="M60 155 Q40 140 30 150 Q35 165 55 158" fill="#A8C5A0" />
      </g>

      {/* Right leaf */}
      <g className="leaf" style={{ transformOrigin: '68px 135px', animationDelay: '0.5s' }}>
        <path d="M60 135 Q80 120 90 130 Q85 145 65 138" fill="#A8C5A0" />
      </g>

      {/* Petals */}
      <g>
        <ellipse className="petal" cx="60" cy="75" rx="22" ry="30" fill={color} opacity="0.9" transform="rotate(0 60 75)" />
        <ellipse className="petal" cx="60" cy="75" rx="22" ry="30" fill={color} opacity="0.85" transform="rotate(72 60 75)" />
        <ellipse className="petal" cx="60" cy="75" rx="22" ry="30" fill={color} opacity="0.8" transform="rotate(144 60 75)" />
        <ellipse className="petal" cx="60" cy="75" rx="22" ry="30" fill={color} opacity="0.85" transform="rotate(216 60 75)" />
        <ellipse className="petal" cx="60" cy="75" rx="22" ry="30" fill={color} opacity="0.9" transform="rotate(288 60 75)" />
      </g>

      {/* Center */}
      <circle className="petal" cx="60" cy="75" r="8" fill="#D4A853" opacity="0.9" style={{ animationDelay: '1.6s' }} />
    </svg>
  )
}
