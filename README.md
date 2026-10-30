# Photo Gallery

A photo gallery built with **React + Vite + Tailwind CSS** for the Celebrare frontend internship pre-screening assignment.

It fetches 30 photos from the [Picsum Photos API](https://picsum.photos/v2/list?limit=30), shows them in a responsive grid, filters them by author name as you type, and lets you mark favourites that survive a page refresh.

The visual style borrows from wedding stationery: engraved-style headings, photos mounted like real prints on paper, and a **wax seal** as the favourite button.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Requirements checklist

| # | Requirement | Where it lives |
|---|-------------|----------------|
| 1 | React + Vite, Tailwind only (no UI libraries) | `vite.config.js`, `src/index.css` |
| 2 | Fetch 30 photos, loading spinner, error message | `src/hooks/useFetchPhotos.js`, `src/components/Spinner.jsx`, error block in `Gallery.jsx` |
| 3 | Grid: 4 columns desktop, 2 tablet, 1 mobile; photo + author + heart | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` in `Gallery.jsx`, `PhotoCard.jsx` |
| 4 | Real-time search by author, no API call | `searchResults` in `Gallery.jsx`, `SearchBar.jsx` |
| 5 | Favourites with `useReducer` + `localStorage` | `src/reducers/favouritesReducer.js`, `useReducer` + `useEffect` in `Gallery.jsx` |
| 6 | Custom hook `useFetchPhotos` returning `photos, loading, error` | `src/hooks/useFetchPhotos.js` |
| 7 | `useCallback` on the search handler, `useMemo` for the filtered list | `handleSearch` and `searchResults` in `Gallery.jsx` |

## Extras

- **Photo viewer** — click any print to open it full screen. The card morphs into the viewer (View Transitions API). Use ← / → to move between photos and Esc to close. It shows the original size and links to the photo on Unsplash.
- **Favourites tab** — switch between all photos and only your favourites; cards slide to their new places. "Clear all" empties the list (a second reducer action).
- **Search shortcuts** — press `/` anywhere to jump to search, Esc or × to clear it.
- **Empty states** — helpful messages when a search matches nothing or there are no favourites yet.
- **Try again** button on the error message.

## Project structure

```
src/
├── main.jsx                      React entry point
├── App.jsx                       Animated page header + <Gallery />
├── index.css                     Tailwind import, design tokens, paper grain, keyframes, view-transition rules
├── hooks/
│   ├── useFetchPhotos.js         Fetch logic → { photos, loading, error }
│   └── useInView.js              IntersectionObserver: reveal cards as they scroll into view
├── reducers/
│   └── favouritesReducer.js      TOGGLE_FAVOURITE / CLEAR_FAVOURITES + loader for saved favourites
├── utils/
│   ├── photoUrl.js               Builds sized Picsum image URLs
│   └── viewTransition.js         Wraps a state update in document.startViewTransition (with fallback)
└── components/
    ├── Gallery.jsx               State, filtering, grid, empty/error states
    ├── SearchBar.jsx             Search input with clear button and "/" shortcut (memoised)
    ├── FilterTabs.jsx            All / Favourites switch (memoised)
    ├── PhotoCard.jsx             One print + wax-seal favourite button (memoised)
    ├── Lightbox.jsx              Full-screen photo viewer
    ├── HeartIcon.jsx             Shared heart SVG
    └── Spinner.jsx               Loading indicator
```

## Design and motion

- **Palette:** vellum `#F3EEF4` background, aubergine ink `#2A1830`, plum wax `#7A1F4B`, champagne foil `#B8955A`. Defined once in `@theme` in `index.css` and used as Tailwind classes like `bg-vellum` and `text-wax`.
- **Type:** Italiana (engraved-style display) for the title and author names, Jost for everything else.
- **Realism:** a fine paper grain over the page, prints with a white border and layered paper shadows, each tilted very slightly as if placed by hand, and a band of light that sweeps across the photo on hover.
- **Motion:**
  - the title letters rise in one by one;
  - cards fade up as they scroll into view;
  - photos "develop" from a blurred colour preview into a sharp image once loaded;
  - the seal stamps down with a ripple when you favourite a photo;
  - the viewer grows out of the clicked card.
- **Accessibility:** every animation is turned off for people who prefer reduced motion (`motion-safe:` / `motion-reduce:` and a check in `viewTransition.js`). Buttons have labels and visible focus rings, and the viewer moves focus in and back out.
- **Performance:** the grid loads 600×400 thumbnails (`/id/{id}/600/400`) with `loading="lazy"` instead of Picsum's 5000px originals. The viewer loads a 1600px version on top of the cached thumbnail.
- **Browser support:** the morph animations use the View Transitions API (Chrome, Edge, Safari 18+). Other browsers get the same result without the morph.
