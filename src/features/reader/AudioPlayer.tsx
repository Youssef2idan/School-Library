import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import type { AudioTrack } from '@/types'

const RATES = [1, 1.25, 1.5, 2, 0.75]

function fmt(s: number): string {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

interface Props {
  tracks: AudioTrack[]
  cover: string
  title: string
  author: string
  onFinished: () => void
}

export default function AudioPlayer({ tracks, cover, title, author, onFinished }: Props) {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState(false)

  const track = tracks[index]

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.defaultPlaybackRate = rate
    a.playbackRate = rate
  }, [rate, index])

  useEffect(() => {
    const a = audioRef.current
    if (a && autoRef.current) {
      autoRef.current = false
      void a.play().catch(() => setPlaying(false))
    }
  }, [index])

  function selectTrack(i: number, autoplay: boolean) {
    autoRef.current = autoplay
    setIndex(i)
    setCurrent(0)
    setDuration(0)
    setError(false)
  }

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) void a.play().catch(() => setError(true))
    else a.pause()
  }

  function skip(seconds: number) {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Math.min(Math.max(a.currentTime + seconds, 0), a.duration || 0)
  }

  function cycleRate() {
    setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length])
  }

  return (
    <div className="space-y-5">
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setError(true)}
        onEnded={() => {
          if (index < tracks.length - 1) selectTrack(index + 1, true)
          else {
            setPlaying(false)
            onFinished()
          }
        }}
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <img src={cover} alt={title} className="w-44 rounded-2xl shadow-2xl shadow-primary/40" />
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted">{author}</p>
          {tracks.length > 1 && <p className="mt-1 text-sm font-semibold text-primary-soft">{track.title}</p>}
        </div>
      </div>

      {error && <p className="text-center text-sm text-danger">{t('reader.audioError')}</p>}

      <div dir="ltr" className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(current, duration || 0)}
          onChange={(e) => {
            const a = audioRef.current
            if (a) a.currentTime = Number(e.target.value)
          }}
          className="h-6 w-full accent-primary-soft"
          aria-label="Seek"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div dir="ltr" className="flex items-center justify-center gap-5">
        <button
          aria-label="Back 10 seconds"
          onClick={() => skip(-10)}
          className="relative flex size-12 items-center justify-center text-fg"
        >
          <RotateCcw size={30} />
          <span className="absolute text-[9px] font-bold">10</span>
        </button>
        <button
          aria-label={playing ? t('reader.pause') : t('reader.play')}
          onClick={toggle}
          className="flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40"
        >
          {playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" />}
        </button>
        <button
          aria-label="Forward 10 seconds"
          onClick={() => skip(10)}
          className="relative flex size-12 items-center justify-center text-fg"
        >
          <RotateCw size={30} />
          <span className="absolute text-[9px] font-bold">10</span>
        </button>
        <button
          aria-label={t('reader.speed')}
          onClick={cycleRate}
          className="flex min-h-11 min-w-14 items-center justify-center rounded-full border border-line bg-surface px-3 text-sm font-bold"
        >
          {rate}x
        </button>
      </div>

      {tracks.length > 1 && (
        <section>
          <h3 className="mb-2 text-sm font-bold">{t('reader.tracks')}</h3>
          <ul className="space-y-2">
            {tracks.map((tr, i) => (
              <li key={tr.url}>
                <button
                  onClick={() => selectTrack(i, true)}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-start text-sm',
                    i === index ? 'border-primary bg-primary/20 font-bold' : 'border-line bg-surface',
                  )}
                >
                  <span className="text-muted">{i + 1}</span>
                  {tr.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}