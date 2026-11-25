interface Props {
  size?: number
}

export default function Logo({ size = 40 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M32 14c-5-4-12-5-22-4v38c10-1 17 0 22 4 5-4 12-5 22-4V10c-10-1-17 0-22 4z"
        stroke="url(#logo-g)"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="rgb(124 58 237 / 0.15)"
      />
      <path d="M32 14v38" stroke="url(#logo-g)" strokeWidth="4" />
    </svg>
  )
}