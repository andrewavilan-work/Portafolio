import { useRef, useCallback } from 'react'

export function useTilt(intensity = 12) {
  const ref = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    el.style.transform = `perspective(1000px) rotateX(${-dy * intensity}deg) rotateY(${dx * intensity}deg) scale3d(1.02,1.02,1.02)`
  }, [intensity])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.4s ease'
  }, [])

  const handleMouseEnter = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.1s ease'
  }, [])

  return { ref, handleMouseMove, handleMouseLeave, handleMouseEnter }
}
