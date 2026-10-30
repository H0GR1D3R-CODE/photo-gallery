import { memo, useEffect, useRef } from 'react'

function SearchBar({ value, onSearch }) {
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(event) {
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="group relative w-full">
      <label htmlFor="photo-search" className="sr-only">
        Search photos by author name
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 fill-none stroke-mist stroke-[1.5] transition-colors group-focus-within:stroke-wax"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        id="photo-search"
        type="text"
        value={value}
        onChange={(event) => onSearch(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && onSearch('')}
        placeholder="Search by photographer…"
        autoComplete="off"
        className="w-full border-0 border-b border-foil/50 bg-transparent py-3 pl-8 pr-10 text-lg font-light text-ink transition-colors placeholder:text-mist/70 focus:border-wax focus:outline-none"
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            onSearch('')
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-mist transition-colors hover:bg-ink/5 hover:text-ink motion-safe:animate-fade-in"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-1 top-1/2 hidden -translate-y-1/2 rounded border border-foil/50 px-1.5 text-xs text-mist sm:block">
          /
        </kbd>
      )}
    </div>
  )
}

export default memo(SearchBar)
