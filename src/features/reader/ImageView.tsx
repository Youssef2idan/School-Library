import { useEffect } from 'react'

interface Props {
  urls: string[]
  page: number
}

export default function ImageView({ urls, page }: Props) {
  // تحميل مسبق للصفحة الجاية
  useEffect(() => {
    const next = urls[page]
    if (next) {
      const img = new Image()
      img.src = next
    }
  }, [urls, page])

  return <img src={urls[page - 1]} alt={`${page}`} className="block w-full bg-white" />
}