import { useEffect, useState } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPhotos() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })

        // fetch doesn't throw on 404 or 500, so check it ourselves
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}.`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while loading photos.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPhotos()

    // cancel the request if the component unmounts
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
