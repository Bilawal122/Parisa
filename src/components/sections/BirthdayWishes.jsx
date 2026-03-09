import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { wishes } from '@data/wishes'
import StarField from '@components/effects/StarField'

export default function BirthdayWishes() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const starsY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const wishCards = useMemo(() =>
    wishes.map((wish, i) => ({
      wish,
      x: 5 + Math.random() * 70,
      delay: i * 0.3,
      duration: 6 + Math.random() * 4,
      size: wish.length > 35 ? 'large' : 'small',
    })), []
  )

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 bg-midnight overflow-hidden min-h-screen">
      <motion.div style={{ y: starsY }} className="absolute inset-0">
        <StarField />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
            Birthday Wishes
          </h2>
          <p className="font-script text-xl sm:text-2xl text-gold/70">
            A sky full of wishes, just for you
          </p>
        </motion.div>

        {/* Wish cards with staggered entrances from alternating sides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishCards.map(({ wish, delay }, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: i % 3 === 0 ? -40 : i % 3 === 1 ? 0 : 40,
                y: 50,
                scale: 0.85,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: delay * 0.2,
                duration: 0.7,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <motion.div
                className="rounded-2xl p-5 sm:p-6 border border-blush/20 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(242,181,212,0.1) 0%, rgba(196,145,123,0.1) 100%)',
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(212,168,83,0.5)' }}
              >
                <p className="font-serif text-base sm:text-lg text-blush-light/90 text-center leading-relaxed italic">
                  "{wish}"
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
