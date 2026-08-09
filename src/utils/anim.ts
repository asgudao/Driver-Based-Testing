/**
 * Orbital Ops Deck — GSAP entrance helper.
 * Tiny, consistent wrapper used across pages for staggered reveals.
 * Honors prefers-reduced-motion: animations only run when the user has
 * NOT requested reduced motion; otherwise elements simply appear.
 */
import gsap from 'gsap'

export interface RevealGroup {
  /** CSS selector (scoped to the page root) for the elements in this group. */
  selector: string
  /** Vertical travel distance in px. Default 24. */
  y?: number
  /** Per-element stagger in seconds. Default 0.08. */
  stagger?: number
  /** Tween duration in seconds. Default 0.7. */
  duration?: number
}

/**
 * Builds a staggered entrance timeline scoped to the given root element.
 * Returns the gsap.MatchMedia instance — call `.revert()` on unmount.
 */
export function revealPage(
  getRoot: () => HTMLElement | null,
  groups: RevealGroup[] = [{ selector: '[data-reveal]' }]
): gsap.MatchMedia {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const root = getRoot()
    if (!root) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      groups.forEach((g, i) => {
        const targets = Array.from(
          root.querySelectorAll<HTMLElement>(g.selector)
        )
        if (!targets.length) return

        tl.from(
          targets,
          {
            opacity: 0,
            y: g.y ?? 24,
            duration: g.duration ?? 0.7,
            stagger: g.stagger ?? 0.08,
            clearProps: 'opacity,transform'
          },
          i === 0 ? 0 : '>-0.35'
        )
      })
    }, root)

    return () => ctx.revert()
  })

  return mm
}
