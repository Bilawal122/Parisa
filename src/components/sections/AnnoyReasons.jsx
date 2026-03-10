import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/*
  Center-scattered word cloud.
  Positions are offsets from center (0,0) in percentage units.
  Each word is placed with transform: translate(-50%, -50%) so
  the coordinate marks the word's visual center.

  layer: 1 = foreground (big, bright), 2 = mid, 3 = background (small, dimmer)
*/
const WORDS = [
  // FOREGROUND — big, near center, well-spaced
  { text: 'Beautiful',     layer: 1, size: 2.8, ox: -2,  oy: -2,  rot: -4,  mox: 0,   moy: 0,   mrot: -3  },
  { text: 'Kind',          layer: 1, size: 2.5, ox: -28, oy: -28, rot: -8,  mox: -14, moy: -26, mrot: -8  },
  { text: 'Genuine',       layer: 1, size: 2.4, ox: 5,   oy: 30,  rot: 3,   mox: 4,   moy: 34,  mrot: 3   },
  { text: 'Dumass',        layer: 1, size: 2.3, ox: 22,  oy: 15,  rot: 5,   mox: -20, moy: 16,  mrot: 6   },

  // MIDGROUND — medium, ring around foreground
  { text: 'Unfunny',       layer: 2, size: 1.8, ox: 25,  oy: -22, rot: -3,  mox: 22,  moy: -18, mrot: -5  },
  { text: 'Thoughtful',    layer: 2, size: 1.8, ox: -28, oy: 8,   rot: 7,   mox: 20,  moy: 14,  mrot: 8   },
  { text: 'Chalant',       layer: 2, size: 1.6, ox: 28,  oy: -4,  rot: -12, mox: -16, moy: -12, mrot: -14 },
  { text: 'Pagal',         layer: 2, size: 1.5, ox: -5,  oy: 17,  rot: -2,  mox: 6,   moy: 44,  mrot: -2  },
  { text: 'Real',          layer: 2, size: 1.6, ox: -22, oy: 26,  rot: 6,   mox: -24, moy: 28,  mrot: 7   },
  { text: 'Loco',          layer: 2, size: 1.5, ox: 18,  oy: 26,  rot: -8,  mox: 24,  moy: 24,  mrot: -8  },

  // BACKGROUND — smaller, orbiting edges, wildly tilted
  { text: 'Bandri',        layer: 3, size: 1.3, ox: -36, oy: -16, rot: 15,  mox: -34, moy: -36, mrot: 18  },
  { text: 'Fairy',         layer: 3, size: 1.2, ox: 36,  oy: -28, rot: -18, mox: 28,  moy: -36, mrot: -20 },
  { text: 'Maj',           layer: 3, size: 1.3, ox: -34, oy: -4,  rot: 20,  mox: -36, moy: 6,   mrot: 22  },
  { text: 'Moti',          layer: 3, size: 1.2, ox: 38,  oy: 10,  rot: 25,  mox: 36,  moy: -6,  mrot: 26  },
  { text: 'Challi',        layer: 3, size: 1.2, ox: 32,  oy: 34,  rot: -22, mox: 34,  moy: 36,  mrot: -22 },
]

const LAYER_COLORS = {
  1: ['#F2B5D4', '#FDE2EF', '#e8a0c0', '#D4A853'],
  2: ['#D4849B', '#C4917B', '#A8C5A0', '#e6bc5e', '#e8a0c0', '#D4A853'],
  3: ['#D4849B', '#C4917B', '#A8C5A0', '#e6bc5e', '#F2B5D4', '#e8a0c0'],
}

/* Per-layer float parameters (applied as per-property transitions) */
const FLOAT = {
  1: (i) => ({
    vals: { y: [0, -6, 0, 5, 0] },
    dur: 6 + i * 0.4,
  }),
  2: (i) => ({
    vals: { y: [0, -4, 0, 3, 0], x: [0, 3, 0, -2, 0] },
    dur: 7 + i * 0.5,
  }),
  3: (i) => ({
    vals: { y: [0, -3, 0, 2, 0], x: [0, -2, 0, 3, 0] },
    dur: 8 + i * 0.3,
  }),
}

export default function AnnoyReasons() {
  const [inView, setInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 640)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-midnight overflow-x-clip"
    >
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #F2B5D4 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      {/* Radial glow behind cloud center */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 45% at 50% 55%, rgba(242,181,212,0.06) 0%, transparent 100%)'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
            This is what I think of you
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush/50">
            scattered, just like your brain
          </p>
        </motion.div>

        {/* Center-scattered cloud */}
        <div className="relative" style={{ height: isMobile ? 520 : 520 }}>
          {WORDS.map((word, i) => {
            const ox = isMobile ? word.mox : word.ox
            const oy = isMobile ? word.moy : word.oy
            const rot = isMobile ? word.mrot : word.rot
            const mScale = isMobile ? (word.layer === 1 ? 0.82 : word.layer === 2 ? 0.8 : 0.78) : 1
            const fontSize = word.size * mScale
            const colors = LAYER_COLORS[word.layer]
            const color = colors[i % colors.length]

            // Glow shadow matching word color
            const glowBase = color.replace(/88$/, '')
            const textShadow = word.layer === 1
              ? `0 0 30px ${glowBase}40, 0 0 60px ${glowBase}15`
              : word.layer === 2
                ? `0 0 20px ${glowBase}25`
                : `0 0 12px ${glowBase}15`

            // Build animate target with per-property transitions
            const float = FLOAT[word.layer](i)
            const delay = 0.08 + i * 0.06
            const targetOpacity = word.layer === 3 ? 0.5 : word.layer === 2 ? 0.85 : 1
            const animateTarget = inView ? {
              opacity: targetOpacity,
              scale: 1,
              rotate: rot,
              ...float.vals,
              transition: {
                opacity: { delay, duration: 0.5 },
                scale: { delay, duration: 0.6, type: 'spring', stiffness: 120, damping: 10 },
                rotate: { delay, duration: 0.6, type: 'spring', stiffness: 120, damping: 10 },
                y: { delay: delay + 0.6, duration: float.dur, repeat: Infinity, ease: 'easeInOut' },
                x: { delay: delay + 0.6, duration: float.dur, repeat: Infinity, ease: 'easeInOut' },
              },
            } : {}

            return (
              <motion.span
                key={word.text}
                className="absolute font-serif select-none cursor-default whitespace-nowrap"
                style={{
                  left: `calc(50% + ${ox}%)`,
                  top: `calc(50% + ${oy}%)`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${fontSize}rem`,
                  color,
                  textShadow,
                  zIndex: 4 - word.layer,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: rot + 35,
                }}
                animate={animateTarget}
                whileHover={{
                  scale: 1.35,
                  color: '#D4A853',
                  textShadow: '0 0 40px rgba(212,168,83,0.5), 0 0 80px rgba(212,168,83,0.2)',
                  rotate: 0,
                  opacity: 1,
                  transition: { duration: 0.25 },
                }}
                whileTap={{
                  scale: 1.4,
                  color: '#D4A853',
                  textShadow: '0 0 50px rgba(212,168,83,0.6), 0 0 100px rgba(212,168,83,0.3)',
                  rotate: 0,
                  opacity: 1,
                }}
              >
                {word.text}
              </motion.span>
            )
          })}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-center font-sans text-blush/30 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          <span className="hidden sm:inline">hover over a word — they're all about you</span>
          <span className="sm:hidden">tap a word — they're all about you</span>
        </motion.p>
      </div>
    </section>
  )
}
