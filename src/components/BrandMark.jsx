import { useState } from 'react';

export function BrandMark({ size = 38, plate = 'var(--accent)', ink = 'var(--accent-ink)', radius = 8, hoverable = true }) {
  const [hover, setHover] = useState(false);
  return (
    <svg
      width={size} height={size} viewBox="0 0 44 44"
      style={{ display: 'block', flexShrink: 0 }}
      onMouseEnter={hoverable ? () => setHover(true) : undefined}
      onMouseLeave={hoverable ? () => setHover(false) : undefined}
      aria-label="Chronos İnşaat"
      role="img"
    >
      {/* Plate */}
      <rect width="44" height="44" rx={radius} fill={plate} />

      {/* Subtle inner hairline — refined plate edge */}
      <rect x="2" y="2" width="40" height="40" rx={radius - 2}
            fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="0.6" />

      {/* Group: monogram, slides slightly on hover */}
      <g style={{
        transition: 'transform .55s var(--ease-out)',
        transform: hover ? 'translate(0.5px, -0.5px)' : 'translate(0,0)',
      }}>
        {/* Serif C — set in Fraunces */}
        <text
          x="14.2" y="31"
          textAnchor="middle"
          fontFamily='Fraunces, "Cormorant Garamond", Georgia, serif'
          fontSize="30"
          fontWeight="350"
          fill={ink}
          style={{
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
            letterSpacing: '-0.04em',
            paintOrder: 'stroke',
          }}
        >C</text>

        {/* İ — column with dot, sharing baseline with C */}
        <g style={{
          transformOrigin: '30px 21px',
          transition: 'transform .65s var(--ease-out) .04s',
          transform: hover ? 'translateY(-0.8px)' : 'translateY(0)',
        }}>
          <circle cx="30" cy="10" r="1.5" fill={ink} />
          <rect x="29.1" y="13" width="1.8" height="16.5" fill={ink} />
          <rect x="27.4" y="13" width="5.2" height="0.9" fill={ink} />
          <rect x="26.6" y="28.6" width="6.8" height="0.9" fill={ink} />
        </g>

        {/* Shared foundation baseline rule */}
        <line x1="6" y1="33" x2="38" y2="33"
              stroke={ink} strokeWidth="0.7" strokeOpacity="0.5" />

        {/* Tiny chronograph tick at the right edge — keystone / time accent */}
        <circle cx="38.4" cy="33" r={hover ? 1.4 : 0.9} fill={ink}
                opacity={hover ? 1 : 0.6}
                style={{ transition: 'r .5s var(--ease-out), opacity .5s' }} />
      </g>
    </svg>
  );
}

export function BrandLogo({ markSize = 36, onClick, light = false }) {
  return (
    <div className="brand" onClick={onClick}>
      <BrandMark size={markSize} />
      <div className="brand-text">
        <span className="b1" style={{ color: light ? '#fff' : undefined }}>Chronos</span>
        <span className="b2">İnşaat / EST.1987</span>
      </div>
    </div>
  );
}
