import Avatar from './Avatar'

interface Props {
  name: string
  rank: 1 | 2 | 3
  size?: number
}

const colors = { 1: '#fbbf24', 2: '#cbd5e1', 3: '#f97316' } as const

export default function MedalAvatar({ name, rank, size = 44 }: Props) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Avatar name={name} size={size} ring={colors[rank]} />
      <span
        className="absolute -bottom-1 -end-1 flex size-5 items-center justify-center rounded-full text-[11px] font-extrabold text-black"
        style={{ background: colors[rank] }}
      >
        {rank}
      </span>
    </div>
  )
}