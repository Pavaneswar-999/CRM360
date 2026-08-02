import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Marketing-only motion. Product pages use Framer Motion for small route
 * transitions, so the two animation systems never contend for the same DOM.
 */
export function LandingMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-landing-root]')
    if (!root) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 0.95,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
    })
    let animationFrame = 0
    const onAnimationFrame = (time: number) => {
      lenis.raf(time)
      animationFrame = window.requestAnimationFrame(onAnimationFrame)
    }
    animationFrame = window.requestAnimationFrame(onAnimationFrame)

    const context = gsap.context(() => {
      const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
      revealTargets.forEach((target) => {
        // Keep meaningful content visible before JavaScript and during keyboard
        // navigation. The motion is an enhancement, not a visibility gate.
        gsap.fromTo(target, { y: 28 }, {
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 86%',
            once: true,
          },
        })
      })

      const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-story-step]'))
      steps.forEach((step, index) => {
        gsap.fromTo(step, { x: index % 2 ? 28 : -28 }, {
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 82%',
            once: true,
          },
        })
      })
    }, root)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      lenis.destroy()
      context.revert()
    }
  }, [])

  return null
}
