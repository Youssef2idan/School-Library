export default function TreasureChest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="chest-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="chest-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b45309" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="80" r="78" fill="url(#chest-glow)" />

      {/* العملات */}
      <ellipse cx="38" cy="132" rx="20" ry="7" fill="url(#chest-gold)" stroke="#b45309" />
      <ellipse cx="38" cy="125" rx="20" ry="7" fill="url(#chest-gold)" stroke="#b45309" />
      <ellipse cx="164" cy="134" rx="18" ry="6" fill="url(#chest-gold)" stroke="#b45309" />
      <ellipse cx="164" cy="128" rx="18" ry="6" fill="url(#chest-gold)" stroke="#b45309" />

      {/* الصندوق */}
      <rect x="48" y="78" width="104" height="56" rx="8" fill="url(#chest-wood)" />
      <path d="M48 82 Q48 36 100 36 Q152 36 152 82 Z" fill="#b45309" />
      <rect x="60" y="36" width="9" height="98" fill="url(#chest-gold)" opacity="0.95" />
      <rect x="131" y="36" width="9" height="98" fill="url(#chest-gold)" opacity="0.95" />
      <rect x="48" y="76" width="104" height="8" fill="url(#chest-gold)" />

      {/* القفل */}
      <rect x="88" y="72" width="24" height="28" rx="5" fill="url(#chest-gold)" stroke="#92400e" />
      <circle cx="100" cy="84" r="4" fill="#78350f" />
      <rect x="98.5" y="86" width="3" height="8" rx="1.5" fill="#78350f" />

      {/* نجوم */}
      <text x="24" y="40" fontSize="18" fill="#fbbf24">★</text>
      <text x="162" y="38" fontSize="22" fill="#fbbf24">★</text>
      <text x="96" y="22" fontSize="12" fill="#fde68a">✦</text>
    </svg>
  )
}