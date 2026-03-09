import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MoonScene from '@components/effects/MoonScene'

export default function MoonSection() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const canvasWidth = typeof window !== 'undefined'
    ? Math.min(520, window.innerWidth - 32)
    : 520

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D0D1A 0%, #141425 25%, #1A1A2E 50%, #141425 75%, #0D0D1A 100%)'
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
            Same Moon, Different Skies
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush/50">
            wherever you are tonight, we share the same sky
          </p>
        </motion.div>

        {inView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <MoonScene width={canvasWidth} height={Math.round(canvasWidth * 1.05)} />
          </motion.div>
        )}

        <motion.p
          className="text-center font-sans text-blush/35 text-sm mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 4, duration: 1 }}
        >
          next time you look up at the moon, just know
          I'm probably looking at the same one and thinking of you
        </motion.p>
      </div>
    </section>
  )
}
