import { useEffect, useRef, useState } from 'react'

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

export function splitSentences(text: string): string[] {
  if (!text.trim()) return []
  const parts = text.match(/[^.!?؟…]+[.!?؟…]*["”’)]*\s*/g)
  return parts ? parts.map((s) => s.trim()).filter(Boolean) : [text]
}

interface Options {
  sentences: string[]
  lang: string
  rate: number
  onFinished: () => void
}

export function useTTS({ sentences, lang, rate, onFinished }: Options) {
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)

  const token = useRef(0)
  const indexRef = useRef(0)
  const sentencesRef = useRef(sentences)
  const langRef = useRef(lang)
  const rateRef = useRef(rate)
  const finishedRef = useRef(onFinished)

  useEffect(() => {
    sentencesRef.current = sentences
    langRef.current = lang
    rateRef.current = rate
    finishedRef.current = onFinished
  })

  useEffect(
    () => () => {
      token.current += 1
      if (ttsSupported) window.speechSynthesis.cancel()
    },
    [],
  )

  function speakFrom(i: number, t: number) {
    const list = sentencesRef.current
    if (i >= list.length) {
      indexRef.current = 0
      setIndex(-1)
      setPlaying(false)
      setPaused(false)
      finishedRef.current()
      return
    }
    indexRef.current = i
    setIndex(i)
    const u = new SpeechSynthesisUtterance(list[i])
    u.lang = langRef.current
    u.rate = rateRef.current
    u.onend = () => {
      if (token.current === t) speakFrom(i + 1, t)
    }
    u.onerror = () => {
      if (token.current === t) {
        setPlaying(false)
        setIndex(-1)
      }
    }
    window.speechSynthesis.speak(u)
  }

  function start(from = 0) {
    if (!ttsSupported) return
    token.current += 1
    window.speechSynthesis.cancel()
    setPlaying(true)
    setPaused(false)
    speakFrom(from, token.current)
  }

  // الـ pause الحقيقي مش مستقر على أندرويد، فبنوقف ونكمل من نفس الجملة
  function pause() {
    token.current += 1
    if (ttsSupported) window.speechSynthesis.cancel()
    setPlaying(false)
    setPaused(true)
  }

  function resume() {
    start(Math.max(indexRef.current, 0))
  }

  function stop() {
    token.current += 1
    if (ttsSupported) window.speechSynthesis.cancel()
    indexRef.current = 0
    setPlaying(false)
    setPaused(false)
    setIndex(-1)
  }

  return { index, playing, paused, start, pause, resume, stop }
}