import { useEffect, useState } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

// Custom hook: keeps all the fetching logic out of the UI.
// Returns { photos, loading, error } so any component can just read the result.
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // AbortController lets us cancel the request if the component unmounts
    // (React StrictMode also mounts → unmounts → mounts again in development).
    const controller = new AbortController()

    async function loadPhotos() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })

        // fetch() only rejects on network failure, so a 404 / 500 must be checked by hand
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}.`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        // A cancelled request is not a real error, so ignore it
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while loading photos.')
        }
      } finally {
        // Only the request that was not cancelled is allowed to end the loading state
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPhotos()

    // Cleanup: runs when the component unmounts
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
