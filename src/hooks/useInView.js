import { useEffect, useRef, useState } from 'react'

// Tells a component when it has scrolled into view (once), using IntersectionObserver.
// Used to fade photo cards in as you scroll down the page.
export default function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // only animate the first time
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
