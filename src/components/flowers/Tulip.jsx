export default function Tulip({ color = '#D4849B', size = 120 }) {
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 120 216" fill="none">
      {/* Stem */}
      <line x1="60" y1="110" x2="60" y2="210" stroke="#7BA376" strokeWidth="3" className="stem-grow" />

      {/* Left leaf */}
      <g className="leaf" style={{ transformOrigin: '50px 165px' }}>
        <path d="M58 165 Q35 145 28 160 Q38 178 56 168" fill="#A8C5A0" />
      </g>

      {/* Petals - tulip cup shape */}
      <path className="petal" d="M60 45 Q30 70 38 105 Q48 115 60 110 Q72 115 82 105 Q90 70 60 45Z" fill={color} opacity="0.9" />
      <path className="petal" d="M60 50 Q40 72 45 100 Q52 108 60 105 L60 50Z" fill={color} opacity="0.7" style={{ animationDelay: '1.0s' }} />
      <path className="petal" d="M60 50 Q80 72 75 100 Q68 108 60 105 L60 50Z" fill={color} opacity="0.75" style={{ animationDelay: '1.1s' }} />
      <path className="petal" d="M48 55 Q38 75 42 98 Q50 105 55 100 L48 55Z" fill={color} opacity="0.6" style={{ animationDelay: '1.2s' }} />
    </svg>
  )
}
