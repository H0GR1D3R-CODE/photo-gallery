import { useEffect, useRef, useState } from 'react'
import { photoUrl } from '../utils/photoUrl'
import HeartIcon from './HeartIcon'

export default function Lightbox({ photos, index, isFavourite, onToggleFavourite, onSelect, onClose }) {
  const photo = photos[index]
  const total = photos.length
  const closeButtonRef = useRef(null)
  const [direction, setDirection] = useState(0)

  function showPrevious() {
    setDirection(-1)
    onSelect(photos[(index - 1 + total) % total].id)
  }

  function showNext() {
    setDirection(1)
    onSelect(photos[(index + 1) % total].id)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeButtonRef.current?.focus()
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo by ${photo.author}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#170c1a]/95 text-vellum backdrop-blur-md motion-safe:animate-fade-in"
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-vellum/60">
          {index + 1} <span className="text-foil">/</span> {total}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center gap-3 rounded-full px-3 py-1.5 text-sm text-vellum/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-foil"
        >
          <kbd className="hidden rounded border border-white/20 px-1.5 text-[0.65rem] text-vellum/50 sm:inline">Esc</kbd>
          Close
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24"
        onClick={(event) => event.target === event.currentTarget && onClose()}
      >
        {total > 1 && <ArrowButton direction="previous" onClick={showPrevious} />}
        <LightboxImage key={photo.id} photo={photo} direction={direction} />
        {total > 1 && <ArrowButton direction="next" onClick={showNext} />}
      </div>

      <div className="flex flex-col gap-4 px-5 pb-6 pt-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-vellum/50">Photographed by</p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl">{photo.author}</h2>
          <p className="mt-1 text-xs text-vellum/50">
            Original {photo.width.toLocaleString()} × {photo.height.toLocaleString()} px
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => onToggleFavourite(photo.id)}
            aria-pressed={isFavourite}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foil ${
              isFavourite ? 'border-wax bg-wax text-white' : 'border-white/25 hover:border-white/60'
            }`}
          >
            <HeartIcon filled={isFavourite} className="h-4 w-4" />
            {isFavourite ? 'Favourited' : 'Add to favourites'}
          </button>
          <a href={photo.url} target="_blank" rel="noreferrer" className={linkClasses}>
            View on Unsplash <span aria-hidden="true">↗</span>
          </a>
          <a href={photo.download_url} target="_blank" rel="noreferrer" className={linkClasses}>
            Full resolution <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

const linkClasses =
  'flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 transition-colors hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foil'

function LightboxImage({ photo, direction }) {
  const [loaded, setLoaded] = useState(false)
  const ratio = photo.width / photo.height
  const largeWidth = 1600

  const slide = direction === 1 ? 'motion-safe:animate-slide-from-right' : direction === -1 ? 'motion-safe:animate-slide-from-left' : ''

  return (
    <div
      className={`relative overflow-hidden bg-black/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${slide}`}
      style={{
        viewTransitionName: 'active-photo',
        aspectRatio: ratio,
        width: `min(100%, calc((100dvh - 15rem) * ${ratio}))`,
      }}
    >
      <img src={photoUrl(photo.id, 600, 400)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={photoUrl(photo.id, largeWidth, Math.round(largeWidth / ratio))}
        alt={`Photograph by ${photo.author}`}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {!loaded && (
        <span
          role="status"
          aria-label="Loading full-size photo"
          className="absolute bottom-3 right-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
        />
      )}
    </div>
  )
}

function ArrowButton({ direction, onClick }) {
  const isNext = direction === 'next'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? 'Next photo' : 'Previous photo'}
      className={`absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur transition-colors hover:border-white/60 hover:bg-black/50 hover:text-white focus-visible:outline-2 focus-visible:outline-foil ${
        isNext ? 'right-3 sm:right-8' : 'left-3 sm:left-8'
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
        <path d={isNext ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
