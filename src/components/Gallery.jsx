import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { flushSync } from 'react-dom'
import useFetchPhotos from '../hooks/useFetchPhotos'
import {
  CLEAR_FAVOURITES,
  favouritesReducer,
  loadFavourites,
  STORAGE_KEY,
  TOGGLE_FAVOURITE,
} from '../reducers/favouritesReducer'
import { withViewTransition } from '../utils/viewTransition'
import FilterTabs from './FilterTabs'
import Lightbox from './Lightbox'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'
import Spinner from './Spinner'

export default function Gallery() {
  // 1. Data comes from the custom hook — Gallery never calls fetch() itself
  const { photos, loading, error } = useFetchPhotos()

  // 2. Favourites live in a reducer. The third argument (loadFavourites) runs once
  //    to read the saved list from localStorage before the first render.
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  const [query, setQuery] = useState('')
  const [view, setView] = useState('all') // 'all' | 'favourites'
  const [activeId, setActiveId] = useState(null) // the photo last opened in the viewer
  const [viewerOpen, setViewerOpen] = useState(false)

  // 3. Save favourites to localStorage every time the list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      // Storage can be full or blocked; the app keeps working, it just won't persist
    }
  }, [favourites])

  // 4. useCallback: keeps the SAME function between renders,
  //    so the memoised SearchBar doesn't re-render when only favourites change.
  const handleSearch = useCallback((value) => {
    setQuery(value)
  }, [])

  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: TOGGLE_FAVOURITE, id })
  }, [])

  const handleClearFavourites = useCallback(() => {
    if (window.confirm('Remove all photos from your favourites?')) {
      dispatch({ type: CLEAR_FAVOURITES })
    }
  }, [])

  // Opening/closing the viewer and switching tabs are wrapped in a View Transition,
  // so the browser animates elements between their old and new positions.
  const handleOpen = useCallback((id) => {
    // First mark which card the viewer grows out of, then open the viewer as a transition
    flushSync(() => setActiveId(id))
    withViewTransition(() => setViewerOpen(true))
  }, [])
  const handleClose = useCallback(() => withViewTransition(() => setViewerOpen(false)), [])
  const handleViewChange = useCallback((nextView) => withViewTransition(() => setView(nextView), 'filter'), [])

  // 5. useMemo: only re-filter when the photos or the search text change,
  //    not on every render (e.g. when a heart is clicked or the viewer opens).
  const searchResults = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return photos
    return photos.filter((photo) => photo.author.toLowerCase().includes(search))
  }, [photos, query])

  // A Set gives a fast "is this photo a favourite?" lookup for each card
  const favouriteIds = useMemo(() => new Set(favourites), [favourites])

  // The Favourites tab narrows the search results down further
  const visiblePhotos = useMemo(
    () => (view === 'favourites' ? searchResults.filter((photo) => favouriteIds.has(photo.id)) : searchResults),
    [searchResults, view, favouriteIds],
  )

  const activeIndex = visiblePhotos.findIndex((photo) => photo.id === activeId)

  // If the open photo leaves the list (e.g. un-favourited while on the Favourites tab), close the viewer.
  // React allows this kind of state update during render; it re-renders straight away.
  if (viewerOpen && activeIndex === -1) {
    setViewerOpen(false)
  }

  const ready = !loading && !error

  return (
    <>
      {/* Search and filters stay pinned to the top while scrolling */}
      <div className="toolbar sticky top-0 z-10 -mx-4 border-b border-foil/20 bg-vellum/85 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
          <div className="lg:max-w-md lg:flex-1">
            <SearchBar value={query} onSearch={handleSearch} />
          </div>
          {ready && (
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 lg:flex-1">
              <FilterTabs view={view} onChange={handleViewChange} total={photos.length} favouriteCount={favourites.length} />
              <p className="text-sm text-mist" aria-live="polite">
                Showing <span className="font-medium tabular-nums text-ink">{visiblePhotos.length}</span> of {photos.length}
              </p>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl pt-12">
        {loading && <Spinner />}

        {error && (
          <div role="alert" className="mx-auto max-w-md bg-print px-8 py-10 text-center shadow-print">
            <p className="font-display text-3xl text-ink">Photos couldn't be loaded</p>
            <p className="mt-3 text-mist">{error}</p>
            <p className="mt-1 text-mist">Check your internet connection and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 cursor-pointer rounded-full bg-ink px-6 py-2.5 text-sm text-vellum transition-colors hover:bg-wax"
            >
              Try again
            </button>
          </div>
        )}

        {ready && view === 'favourites' && favourites.length > 0 && (
          <div className="mb-10 flex items-center justify-between border-b border-foil/20 pb-4 motion-safe:animate-fade-in">
            <p className="font-display text-3xl text-ink">Your favourites</p>
            <button
              type="button"
              onClick={handleClearFavourites}
              className="cursor-pointer text-sm text-mist underline decoration-foil/60 underline-offset-4 transition-colors hover:text-wax"
            >
              Clear all
            </button>
          </div>
        )}

        {ready && visiblePhotos.length === 0 && (
          <EmptyState
            noFavourites={view === 'favourites' && favourites.length === 0}
            query={query}
            onClearSearch={() => handleSearch('')}
            onShowAll={() => handleViewChange('all')}
          />
        )}

        {ready && visiblePhotos.length > 0 && (
          // 1 column on mobile, 2 on tablet (md), 4 on desktop (lg)
          <section className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {visiblePhotos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                isFavourite={favouriteIds.has(photo.id)}
                isMorphTarget={photo.id === activeId && !viewerOpen}
                onToggleFavourite={handleToggleFavourite}
                onOpen={handleOpen}
              />
            ))}
          </section>
        )}
      </main>

      {viewerOpen && activeIndex !== -1 && (
        <Lightbox
          photos={visiblePhotos}
          index={activeIndex}
          isFavourite={favouriteIds.has(activeId)}
          onToggleFavourite={handleToggleFavourite}
          onSelect={setActiveId}
          onClose={handleClose}
        />
      )}
    </>
  )
}

function EmptyState({ noFavourites, query, onClearSearch, onShowAll }) {
  return (
    <div className="mx-auto max-w-sm py-24 text-center motion-safe:animate-fade-in">
      {noFavourites ? (
        <>
          <p className="font-display text-3xl text-ink">No favourites yet</p>
          <p className="mt-3 text-mist">Tap the seal on any photo to keep it here.</p>
          <button type="button" onClick={onShowAll} className={emptyButtonClasses}>
            Browse all photos
          </button>
        </>
      ) : (
        <>
          <p className="font-display text-3xl text-ink">No matches</p>
          <p className="mt-3 text-mist">
            No photographer matches “<span className="text-ink">{query}</span>”.
          </p>
          <button type="button" onClick={onClearSearch} className={emptyButtonClasses}>
            Clear search
          </button>
        </>
      )}
    </div>
  )
}

const emptyButtonClasses =
  'mt-6 cursor-pointer rounded-full border border-ink/20 px-5 py-2 text-sm text-ink transition-colors hover:border-wax hover:text-wax'
