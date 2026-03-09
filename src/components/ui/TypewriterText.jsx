import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export default function TypewriterText({ text, speed = 45, delay = 0, className = '', onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !started) {
      const timeout = setTimeout(() => {
        setStarted(true)
        let i = 0
        const interval = setInterval(() => {
          i++
          setDisplayed(text.slice(0, i))
          if (i >= text.length) {
            clearInterval(interval)
            setDone(true)
            onComplete?.()
          }
        }, speed)
        return () => clearInterval(interval)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [isInView, started, text, speed, delay, onComplete])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {started && !done && <span className="animate-blink text-blush">|</span>}
    </span>
  )
}
