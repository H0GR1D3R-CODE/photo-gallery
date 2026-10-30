import { memo, useState } from 'react'
import useInView from '../hooks/useInView'
import { photoUrl } from '../utils/photoUrl'
import HeartIcon from './HeartIcon'

function PhotoCard({ photo, index, isFavourite, isMorphTarget, onToggleFavourite, onOpen }) {
  const [ref, inView] = useInView()
  const [loaded, setLoaded] = useState(false)
  const [justSealed, setJustSealed] = useState(false)

  const tilt = (((Number(photo.id) * 7) % 5) - 2) * 0.4

  function handleSealClick() {
    if (!isFavourite) setJustSealed(true)
    onToggleFavourite(photo.id)
  }

  return (
    <article
      ref={ref}
      style={{
        '--card-name': `card-${photo.id}`,
        transitionDelay: `${(index % 4) * 90}ms`,
      }}
      className={`photo-card group transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div
        style={{ '--tilt': `${tilt}deg` }}
        className="relative rotate-(--tilt) bg-print p-2.5 shadow-print transition-[rotate,translate,box-shadow] duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-0 group-hover:shadow-print-lifted"
      >
        <button
          type="button"
          onClick={() => onOpen(photo.id)}
          aria-label={`Open ${photo.author}'s photo`}
          style={{ viewTransitionName: isMorphTarget ? 'active-photo' : 'none' }}
          className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-[#e7e0e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wax"
        >
          <img
            src={photoUrl(photo.id, 24, 16)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          />

          <div className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
            <img
              src={photoUrl(photo.id, 600, 400)}
              alt={`Photograph by ${photo.author}`}
              width="600"
              height="400"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`h-full w-full object-cover transition-[opacity,filter,scale] duration-[1200ms] ease-out ${
                loaded ? 'scale-100 opacity-100 blur-none' : 'scale-105 opacity-0 blur-lg'
              }`}
            />
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.3)_50%,transparent_65%)] transition-transform duration-1000 ease-out group-hover:translate-x-full motion-reduce:hidden"
          />
        </button>

        <button
          type="button"
          onClick={handleSealClick}
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Remove ${photo.author}'s photo from favourites` : `Add ${photo.author}'s photo to favourites`}
          className={`absolute -bottom-5 right-5 grid h-12 w-12 cursor-pointer place-items-center transition-[scale,background-color] duration-200 hover:scale-110 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wax ${
            isFavourite
              ? `rounded-[47%_53%_50%_50%/52%_48%_52%_48%] bg-[radial-gradient(circle_at_35%_30%,#a3366a,var(--color-wax)_45%,var(--color-wax-deep))] text-vellum shadow-[inset_0_0_0_4px_rgba(0,0,0,0.12),inset_0_0_0_5px_rgba(201,168,106,0.55),0_4px_10px_-2px_rgba(78,16,48,0.5)] ${
                  justSealed ? 'motion-safe:animate-stamp' : ''
                }`
              : 'rounded-full border border-dashed border-foil bg-print text-wax shadow-sm hover:bg-[#fbf3f7]'
          }`}
        >
          {justSealed && (
            <span
              aria-hidden="true"
              onAnimationEnd={() => setJustSealed(false)}
              className="absolute inset-0 animate-ring rounded-full border-2 border-wax motion-reduce:hidden"
            />
          )}
          <HeartIcon filled={isFavourite} />
        </button>
      </div>

      <div className="mt-8 px-1">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-mist">Photographed by</p>
        <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{photo.author}</h2>
      </div>
    </article>
  )
}

export default memo(PhotoCard)
