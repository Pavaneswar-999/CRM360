import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function PageTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion()

  return <motion.div
    className={className}
    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
}
