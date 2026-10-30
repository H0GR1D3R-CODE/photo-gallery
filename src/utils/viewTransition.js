import { flushSync } from 'react-dom'

let currentTransition = null

export function withViewTransition(update, type = 'default') {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!document.startViewTransition || prefersReducedMotion) {
    update()
    return
  }

  const root = document.documentElement
  root.dataset.transition = type

  const transition = document.startViewTransition(() => {
    flushSync(update)
  })

  transition.ready.catch(() => {})

  currentTransition = transition
  transition.finished.finally(() => {
    if (currentTransition === transition) delete root.dataset.transition
  })
}
