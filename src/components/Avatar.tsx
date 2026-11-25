import { cn } from '@/lib/cn'

interface Props {
  name: string
  src?: string
  size?: number
  ring?: string
  className?: string
}

const palette = ['#7c3aed', '#db2777', '#0891b2', '#d97706', '#059669', '#2563eb']

function colorFor(name: string): string {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % palette.length
  return palette[h]
}

export default function Avatar({ name, src, size = 44, ring, className }: Props) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.42,
    boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
  }

  if (src) {
    return <img src={src} alt={name} style={style} className={cn('rounded-full object-cover', className)} />
  }

  return (
    <div
      style={{ ...style, background: `linear-gradient(135deg, ${colorFor(name)}, #1c1243)` }}
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold', className)}
    >
      {name.charAt(0)}
    </div>
  )
}