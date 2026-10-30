import { flushSync } from 'react-dom'

let currentTransition = null

// Runs a state update inside the browser's View Transitions API, so elements smoothly
// morph from their old position/size to the new one (e.g. a card growing into the photo viewer).
// Browsers without support, or people who prefer reduced motion, just get the update instantly.
//
// `type` is written onto <html data-transition="..."> while the animation runs,
// so CSS can decide which elements take part (see index.css).
export function withViewTransition(update, type = 'default') {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!document.startViewTransition || prefersReducedMotion) {
    update()
    return
  }

  const root = document.documentElement
  root.dataset.transition = type

  // flushSync makes React apply the update right away, so the browser can
  // take its "after" snapshot as soon as this callback finishes.
  const transition = document.startViewTransition(() => {
    flushSync(update)
  })

  // If a new transition starts before this one finishes, the browser skips this one and
  // rejects `ready`. That's expected (the update still happens), so we ignore it.
  transition.ready.catch(() => {})

  currentTransition = transition
  transition.finished.finally(() => {
    // Only clean up if no newer transition has started in the meantime
    if (currentTransition === transition) delete root.dataset.transition
  })
}
