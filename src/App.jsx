import { Fragment } from 'react'
import Gallery from './components/Gallery'

const TITLE = 'Photo Gallery'

export default function App() {
  return (
    <div className="min-h-screen bg-vellum px-4 pb-24 font-sans text-ink antialiased sm:px-8">
      <header className="mx-auto max-w-3xl pb-10 pt-16 text-center sm:pt-24">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-mist motion-safe:animate-fade-in">
          Thirty photographs from Picsum
        </p>

        <h1
          aria-label={TITLE}
          className="mt-5 font-display text-5xl uppercase tracking-[0.18em] text-ink sm:text-6xl lg:text-7xl"
        >
          {TITLE.split(' ').map((word, wordIndex) => (
            <Fragment key={word}>
              {wordIndex > 0 && ' '}
              <span aria-hidden="true" className="inline-block whitespace-nowrap">
                {word.split('').map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="inline-block motion-safe:animate-letter"
                    style={{ animationDelay: `${150 + (wordIndex * 6 + charIndex) * 45}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>

        <div aria-hidden="true" className="mx-auto mt-7 flex max-w-xs items-center gap-4 text-foil">
          <span className="h-px flex-1 origin-right bg-gradient-to-r from-transparent to-foil motion-safe:animate-draw [animation-delay:700ms]" />
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.2] motion-safe:animate-fade-in [animation-delay:600ms]">
            <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
            <path d="M12 7.5 16.5 12 12 16.5 7.5 12z" className="fill-current" />
          </svg>
          <span className="h-px flex-1 origin-left bg-gradient-to-l from-transparent to-foil motion-safe:animate-draw [animation-delay:700ms]" />
        </div>

        <p className="mx-auto mt-7 max-w-md font-light leading-relaxed text-mist motion-safe:animate-fade-in [animation-delay:900ms]">
          Search by photographer, open any print to see it full size, and tap the seal to keep the ones you love.
        </p>
      </header>

      <Gallery />
    </div>
  )
}
