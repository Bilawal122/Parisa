import { motion } from 'framer-motion'
import { useCountdown } from '@hooks/useCountdown'
import { useConfetti } from '@hooks/useConfetti'
import { useEffect, useRef } from 'react'
import { Clock, PartyPopper } from 'lucide-react'

// March 11 in UTC so it works regardless of viewer's timezone
const BIRTHDAY = '2026-03-11T00:00:00Z'

function TimeUnit({ value, label, index }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
    >
      <motion.div
        className="w-[72px] h-[72px] sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center border border-white/20"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(242,181,212,0.15)',
        }}
        key={value}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <span className="font-serif text-2xl sm:text-5xl text-blush-light font-bold">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="font-sans text-xs sm:text-sm text-blush/60 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  )
}

export default function Countdown() {
  const { timeLeft, isComplete } = useCountdown(BIRTHDAY)
  const { triggerCelebration } = useConfetti()
  const hasCelebrated = useRef(false)

  useEffect(() => {
    if (isComplete && !hasCelebrated.current) {
      hasCelebrated.current = true
      triggerCelebration()
    }
  }, [isComplete, triggerCelebration])

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B3D 50%, #1A1A2E 100%)'
    }}>
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #F2B5D4 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {!isComplete ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Clock className="text-gold mx-auto mb-4" size={36} />
              <h2 className="font-serif text-3xl sm:text-5xl text-blush-light font-bold mb-3">
                Counting Down To Your Day
              </h2>
              <p className="font-script text-xl sm:text-2xl text-blush/60 mb-3">
                No matter the timezone...
              </p>
              <p className="font-sans text-sm text-blush/40 mb-12">
                March 11th is coming and distance can't change that
              </p>
            </motion.div>

            <div className="flex justify-center gap-3 sm:gap-6">
              <TimeUnit value={timeLeft.days} label="Days" index={0} />
              <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
              <TimeUnit value={timeLeft.minutes} label="Minutes" index={2} />
              <TimeUnit value={timeLeft.seconds} label="Seconds" index={3} />
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <PartyPopper className="text-gold mx-auto mb-6" size={64} />
            <h2 className="font-serif text-4xl sm:text-6xl text-blush-light font-bold mb-4">
              IT'S YOUR DAY!
            </h2>
            <p className="font-script text-2xl sm:text-3xl text-gold mb-3">
              Happy Birthday, Parisa!
            </p>
            <p className="font-sans text-sm text-blush/50">
              Different timezones, same love for you
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
