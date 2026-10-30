import { memo } from 'react'

// Switch between all photos and only favourites. The dark pill slides under the active option.
function FilterTabs({ view, onChange, total, favouriteCount }) {
  const options = [
    { id: 'all', label: 'All photos', count: total },
    { id: 'favourites', label: 'Favourites', count: favouriteCount },
  ]

  return (
    <div className="relative inline-grid shrink-0 grid-cols-2 rounded-full border border-foil/40 bg-print/70 p-1 text-sm">
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          view === 'favourites' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {options.map((option) => {
        const active = view === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={active}
            className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-1.5 whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wax ${
              active ? 'text-vellum' : 'text-mist hover:text-ink'
            }`}
          >
            {option.label}
            <span
              className={`min-w-5 rounded-full px-1.5 text-xs tabular-nums transition-colors duration-300 ${
                active ? 'bg-white/15 text-vellum' : 'bg-ink/5 text-ink'
              }`}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default memo(FilterTabs)
