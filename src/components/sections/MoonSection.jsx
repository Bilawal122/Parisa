import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import MoonScene from '@components/effects/MoonScene'

export default function MoonSection() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: moon canvas moves slower than scroll (depth effect)
  const moonY = useTransform(scrollYProgress, [0, 1], [60, -60])
  // Text moves at a different rate
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -20])
  // Section fade at edges
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3])

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
      className="relative py-12 sm:py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D0D1A 0%, #141425 25%, #1A1A2E 50%, #141425 75%, #0D0D1A 100%)'
      }}
    >
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4"
        style={{ opacity: sectionOpacity }}
      >
        {/* Title with parallax */}
        <motion.div
          className="text-center mb-6 sm:mb-10"
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
            Same Moon, Different Sky
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush/50">
            you might have been wondering where the last day was from your garden, well this is your 7th day
          </p>
        </motion.div>

        {/* Moon canvas with parallax depth */}
        {inView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ y: moonY }}
          >
            <MoonScene width={canvasWidth} height={Math.round(canvasWidth * 1.05)} />
          </motion.div>
        )}

        {/* Bottom message */}
        <motion.p
          className="text-center font-sans text-blush/35 text-sm mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2, duration: 1 }}
        >
          next time you look at the moon, remember that you made me love the moon even more than I already did
        </motion.p>
      </motion.div>
    </section>
  )
}
