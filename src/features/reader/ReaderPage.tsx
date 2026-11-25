import { BookOpen, Headphones } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Chip, Modal, TopBar } from '@/components'
import { booksApi } from '@/lib/api'
import type { BookWithStatus } from '@/lib/api'
import { getBookFormat } from '@/lib/bookFormat'
import AudioPlayer from './AudioPlayer'
import ImageView from './ImageView'
import PageNav from './PageNav'
import PdfView from './PdfView'
import TextView from './TextView'
import TtsControls from './TtsControls'
import { splitSentences, ttsSupported, useTTS } from './useTTS'

type Mode = 'read' | 'listen'
type Status = 'loading' | 'ready' | 'missing'

export default function ReaderPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [book, setBook] = useState<BookWithStatus | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [page, setPage] = useState(1)
  const [pdfPages, setPdfPages] = useState(0)
  const [mode, setMode] = useState<Mode>('read')
  const [rate, setRate] = useState(1)
  const [reward, setReward] = useState<{ amount: number; milestone: number } | null>(null)

  const completedRef = useRef(false)
  const maxPageRef = useRef(1)
  const autoRef = useRef(false)

  const format = book ? getBookFormat(book) : null
  const total = !book
    ? 0
    : format === 'text'
      ? (book.pages?.length ?? 0)
      : format === 'images'
        ? (book.imageUrls?.length ?? 0)
        : format === 'pdf'
          ? pdfPages
          : 0

  // تحميل الكتاب
  useEffect(() => {
    let cancelled = false
    void booksApi
      .get(id)
      .then((b) => {
        if (cancelled) return
        if (!b.unlocked) {
          navigate('/books', { replace: true })
          return
        }
        const f = getBookFormat(b)
        const count =
          f === 'text'
            ? (b.pages?.length ?? 1)
            : f === 'images'
              ? (b.imageUrls?.length ?? 1)
              : Number.MAX_SAFE_INTEGER // الـ PDF بيتظبط لما يتحمل
        const start = Math.min(Math.max(b.lastPage, 1), count)
        completedRef.current = b.completed
        maxPageRef.current = start
        setPage(start)
        setBook(b)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('missing')
      })
    return () => {
      cancelled = true
    }
  }, [id, navigate])

  const handlePdfLoaded = useCallback((n: number) => {
    setPdfPages(n)
    setPage((p) => Math.min(p, n))
    maxPageRef.current = Math.min(maxPageRef.current, n)
  }, [])

  // إنهاء الكتاب (مرة واحدة)
  const finish = useCallback(async () => {
    if (!book || completedRef.current) return
    completedRef.current = true
    const res = await booksApi.complete(book.id)
    if (res.awarded > 0) setReward({ amount: res.awarded, milestone: res.milestone })
  }, [book])

  // القراءة بصوت الجهاز (للكتب النصية)
  const pageText = format === 'text' ? (book?.pages?.[page - 1]?.text ?? '') : ''
  const sentences = useMemo(() => splitSentences(pageText), [pageText])

  const tts = useTTS({
    sentences,
    lang: book?.language === 'ar' ? 'ar-SA' : 'en-US',
    rate,
    onFinished: () => {
      if (page < total) {
        autoRef.current = true
        setPage(page + 1)
      } else {
        void finish()
      }
    },
  })

  // كمّل القراءة تلقائيًا في الصفحة الجاية
  useEffect(() => {
    if (autoRef.current) {
      autoRef.current = false
      tts.start(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // حفظ التقدم + نشاط اليوم
  useEffect(() => {
    if (!book) return
    const isNew = page > maxPageRef.current
    if (isNew) maxPageRef.current = page
    void booksApi.saveProgress(book.id, page, isNew)
  }, [book, page])

  // الوصول لآخر صفحة في وضع القراءة = إنهاء الكتاب
  useEffect(() => {
    if (mode === 'read' && book && total > 0 && page >= total) void finish()
  }, [mode, book, total, page, finish])

  if (status === 'loading') {
    return <p className="p-10 text-center text-muted">{t('common.loading')}</p>
  }

  if (status === 'missing' || !book || !format) {
    return (
      <div className="mx-auto max-w-[430px]">
        <TopBar title="" />
        <p className="p-10 text-center text-muted">
          {status === 'missing' ? t('reader.notFound') : t('reader.bookEmpty')}
        </p>
      </div>
    )
  }

  const tracks = book.audioTracks ?? []
  const hasAudio = tracks.length > 0
  const canListen = hasAudio || (format === 'text' && ttsSupported)

  const goTo = (n: number) => {
    tts.stop()
    setPage(Math.min(Math.max(n, 1), total))
  }

  const switchMode = (m: Mode) => {
    if (m === 'read') tts.stop()
    setMode(m)
  }

  const toggleTts = () => {
    if (tts.playing) tts.pause()
    else if (tts.paused) tts.resume()
    else tts.start(0)
  }

  const nav = (
    <PageNav page={page} total={total} onPrev={() => goTo(page - 1)} onNext={() => goTo(page + 1)} />
  )

  const listeningToFile = mode === 'listen' && hasAudio

  return (
    <div className="safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col">
      <TopBar title={book.title} />

      <div className="flex gap-2 px-4 pb-2 pt-1">
        <Chip
          active={mode === 'read'}
          onClick={() => switchMode('read')}
          className="inline-flex items-center justify-center gap-1.5"
        >
          <BookOpen size={18} />
          {t('reader.read')}
        </Chip>
        <Chip
          active={mode === 'listen'}
          disabled={!canListen}
          title={canListen ? undefined : t('reader.listenUnavailable')}
          onClick={() => switchMode('listen')}
          className="inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <Headphones size={18} />
          {t('reader.listen')}
        </Chip>
      </div>

      <div className="flex-1 space-y-4 p-4">
        {listeningToFile ? (
          <AudioPlayer
            tracks={tracks}
            cover={book.coverUrl}
            title={book.title}
            author={book.author}
            onFinished={() => void finish()}
          />
        ) : (
          <>
            {format === 'text' && (
              <TextView book={book} sentences={sentences} activeIndex={tts.index} footer={nav} />
            )}

            {format === 'images' && book.imageUrls && (
              <>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <ImageView urls={book.imageUrls} page={page} />
                </div>
                {nav}
              </>
            )}

            {format === 'pdf' && book.pdfUrl && (
              <>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <PdfView url={book.pdfUrl} page={page} onLoaded={handlePdfLoaded} />
                </div>
                {nav}
              </>
            )}

            {mode === 'listen' && !hasAudio && (
              <TtsControls playing={tts.playing} rate={rate} onToggle={toggleTts} onRate={setRate} />
            )}
          </>
        )}
      </div>

      <Modal open={!!reward} onClose={() => setReward(null)}>
        <div className="mb-2 text-5xl">🎉</div>
        <h2 className="mb-3 text-xl font-bold">{t('reader.finished')}</h2>
        <p className="text-3xl font-extrabold text-coin">+{reward?.amount ?? 0}</p>
        {reward && reward.milestone > 0 && (
          <p className="mt-2 text-sm font-semibold text-primary-soft">
            {t('reader.bonus')} +{reward.milestone}
          </p>
        )}
        <div className="mt-5">
          <Button fullWidth onClick={() => setReward(null)}>
            {t('reader.ok')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
