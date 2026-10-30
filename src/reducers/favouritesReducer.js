export const STORAGE_KEY = 'gallery-favourites'

export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE'
export const CLEAR_FAVOURITES = 'CLEAR_FAVOURITES'

// state is an array of photo ids
export function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const id = action.id
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

export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // bad JSON or storage blocked, start empty
    return []
  }
}
