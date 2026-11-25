export default function StackedBooks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="b1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="b2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="b3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="128" rx="62" ry="8" fill="rgb(0 0 0 / 0.35)" />
      <g transform="translate(14 88)">
        <rect width="124" height="30" rx="5" fill="url(#b3)" />
        <rect x="6" y="22" width="112" height="5" rx="2" fill="#f5f3ff" opacity="0.85" />
      </g>
      <g transform="translate(24 58)">
        <rect width="116" height="30" rx="5" fill="url(#b2)" />
        <rect x="6" y="22" width="104" height="5" rx="2" fill="#fef2f2" opacity="0.85" />
      </g>
      <g transform="translate(34 12) rotate(-8 50 40)">
        <rect width="92" height="46" rx="5" fill="url(#b1)" />
        <rect x="6" y="6" width="6" height="34" rx="2" fill="#93c5fd" opacity="0.7" />
        <rect x="18" y="14" width="56" height="5" rx="2" fill="#dbeafe" opacity="0.8" />
        <rect x="18" y="24" width="40" height="5" rx="2" fill="#dbeafe" opacity="0.6" />
      </g>
    </svg>
  )
}