import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
  { text: 'kind', size: 2.2 },
  { text: 'funny', size: 1.8 },
  { text: 'brilliant', size: 2.0 },
  { text: 'warm', size: 1.5 },
  { text: 'stubborn', size: 1.6 },
  { text: 'strong', size: 1.9 },
  { text: 'genuine', size: 1.7 },
  { text: 'irreplaceable', size: 2.0 },
  { text: 'beautiful', size: 2.1 },
  { text: 'brave', size: 1.5 },
  { text: 'thoughtful', size: 1.8 },
  { text: 'inspiring', size: 1.6 },
  { text: 'chaos', size: 1.4 },
  { text: 'home', size: 2.3 },
  { text: 'light', size: 1.7 },
  { text: 'everything', size: 2.5 },
]

export default function AnnoyReasons() {
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
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const wordPositions = useMemo(() => {
    const seed = (i) => Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5
    return WORDS.map((w, i) => {
      const maxX = Math.max(5, 70 - w.text.length * 1.5 - w.size * 3)
      return {
        ...w,
        x: 3 + (i % 4) * (maxX / 4) + seed(i) * 12,
        y: 6 + Math.floor(i / 4) * 22 + seed(i + 50) * 8,
        rotate: -8 + seed(i + 100) * 16,
        delay: i * 0.12,
      }
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-midnight overflow-hidden"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, #F2B5D4 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
            Words That Remind Me of You
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush/50">
            scattered, just like my thoughts when I talk to you
          </p>
        </motion.div>

        {/* Word cloud */}
        <div className="relative min-h-[400px] sm:min-h-[450px]">
          {wordPositions.map((word, i) => (
            <motion.span
              key={i}
              className="absolute font-serif select-none cursor-default"
              style={{
                left: `${word.x}%`,
                top: `${word.y}%`,
                fontSize: `${word.size}rem`,
                color: [
                  '#F2B5D4', '#D4849B', '#D4A853', '#C4917B',
                  '#FDE2EF', '#A8C5A0', '#e8a0c0', '#e6bc5e',
                ][i % 8],
              }}
              initial={{ opacity: 0, scale: 0, rotate: word.rotate + 20 }}
              animate={inView ? {
                opacity: [0, 0.9],
                scale: [0, 1],
                rotate: word.rotate,
              } : {}}
              transition={{
                delay: word.delay,
                duration: 0.7,
                type: 'spring',
                stiffness: 150,
                damping: 12,
              }}
              whileHover={{
                scale: 1.2,
                color: '#D4A853',
                transition: { duration: 0.2 },
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-center font-sans text-blush/30 text-sm mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.5 }}
        >
          hover over a word — they're all about you
        </motion.p>
      </div>
    </section>
  )
}
