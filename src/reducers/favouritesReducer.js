export const STORAGE_KEY = 'gallery-favourites'

export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE'
export const CLEAR_FAVOURITES = 'CLEAR_FAVOURITES'

// State shape: an array of photo ids, e.g. ['0', '12', '27']
export function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const id = action.id
      // Already a favourite → remove it. Otherwise → add it.
      // We always return a NEW array so React notices the change.
      return state.includes(id)
        ? state.filter((favId) => favId !== id)
        : [...state, id]
    }
    case CLEAR_FAVOURITES:
      return []
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

// Lazy initialiser for useReducer: reads saved favourites once, on the first render.
export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupted JSON or storage blocked (e.g. private mode) → start empty
    return []
  }
}
