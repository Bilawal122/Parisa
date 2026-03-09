export default function Daisy({ color = '#FDE2EF', size = 120 }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 120 216" fill="none">
      {/* Stem */}
      <line x1="60" y1="105" x2="60" y2="210" stroke="#7BA376" strokeWidth="2.5" className="stem-grow" />

      {/* Leaves */}
      <g className="leaf" style={{ transformOrigin: '55px 150px' }}>
        <path d="M58 150 Q38 138 32 148 Q38 162 55 153" fill="#A8C5A0" />
      </g>
      <g className="leaf" style={{ transformOrigin: '65px 170px', animationDelay: '0.3s' }}>
        <path d="M62 170 Q82 158 88 168 Q82 182 65 173" fill="#A8C5A0" />
      </g>

      {/* Petals - daisy style, thin and long */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={angle}
          className="petal"
          cx="60"
          cy="55"
          rx="8"
          ry="25"
          fill={color}
          opacity="0.9"
          transform={`rotate(${angle} 60 75)`}
          style={{ animationDelay: `${0.8 + i * 0.1}s` }}
        />
      ))}

      {/* Center */}
      <circle className="petal" cx="60" cy="75" r="12" fill="#D4A853" style={{ animationDelay: '1.7s' }} />
    </svg>
  )
}
