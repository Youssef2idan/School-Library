import * as pdfjs from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

interface Props {
  url: string
  page: number
  onLoaded: (pages: number) => void
}

export default function PdfView({ url, page, onLoaded }: Props) {
  const { t } = useTranslation()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const task = pdfjs.getDocument(url)
    task.promise
      .then((d) => {
        if (cancelled) {
          void d.destroy()
          return
        }
        setDoc(d)
        onLoaded(d.numPages)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
      void task.destroy()
    }
  }, [url, onLoaded])

  useEffect(() => {
    if (!doc) return
    let cancelled = false
    let renderTask: RenderTask | null = null

    void doc.getPage(page).then(async (p) => {
      if (cancelled) return
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return

      const base = p.getViewport({ scale: 1 })
      const scale = wrap.clientWidth / base.width
      const dpr = window.devicePixelRatio || 1
      const viewport = p.getViewport({ scale: scale * dpr })

      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = '100%'
      canvas.style.height = 'auto'

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const params = { canvasContext: ctx, viewport, canvas }
      renderTask = p.render(params as Parameters<typeof p.render>[0])
      try {
        await renderTask.promise
      } catch {
        /* render cancelled */
      }
    })

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [doc, page])

  if (error) return <p className="p-8 text-center text-sm text-danger">{t('reader.pdfError')}</p>

  return (
    <div ref={wrapRef} className="min-h-64 w-full bg-white">
      {!doc && <p className="p-8 text-center text-sm text-neutral-500">{t('reader.pdfLoading')}</p>}
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}