import { useEffect, useRef } from 'react'

// rootMargin: '0px 0px 80px 0px'
//   Positive bottom margin = the observer fires 80px BEFORE the element
//   reaches the viewport bottom edge. This fixes the issue where bottom-row
//   items in 2-column grids (short viewports) never trigger on page load.

export function useReveal(threshold = 0.01) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    )

    const targets = el.querySelectorAll('.reveal')
    targets.forEach(t => observer.observe(t))
    if (el.classList.contains('reveal')) observer.observe(el)

    return () => observer.disconnect()
  }, [threshold])

  return ref
}

export function useRevealSingle(threshold = 0.01) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
