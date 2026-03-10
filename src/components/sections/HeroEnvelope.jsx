import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfetti } from '@hooks/useConfetti'
import { ChevronDown } from 'lucide-react'

export default function HeroEnvelope({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const { triggerConfetti } = useConfetti()

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !cardRevealed)
    return () => document.body.classList.remove('no-scroll')
  }, [cardRevealed])

  const handleClick = () => {
    if (isOpen) return
    setIsOpen(true)

    setTimeout(() => {
      setCardRevealed(true)
      triggerConfetti({ particleCount: 150, spread: 360, origin: { y: 0.35 } })
      setTimeout(() => {
        triggerConfetti({ particleCount: 60, spread: 180, origin: { x: 0.3, y: 0.4 } })
      }, 300)
      setTimeout(() => {
        triggerConfetti({ particleCount: 60, spread: 180, origin: { x: 0.7, y: 0.4 } })
      }, 500)
    }, 900)

    setTimeout(() => {
      setShowScroll(true)
      onOpen?.()
    }, 2500)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-cream overflow-hidden px-4">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-blush-light/20 to-cream" />

      <motion.div
        className="relative z-10 envelope-wrapper"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.3 }}
      >
        <div className="envelope" onClick={handleClick}>
          {/* Envelope back flap (visible when front flap opens) */}
          <div className="envelope-flap-back" />

          {/* Inner card */}
          <div className={`envelope-inner ${cardRevealed ? 'revealed' : ''}`}>
            <AnimatePresence>
              {cardRevealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-center"
                >
                  <p className="font-script text-gold text-lg sm:text-xl mb-1">Happy Birthday</p>
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold">Parisa</h1>
                  <p className="font-sans text-charcoal/50 text-xs mt-2">Well, here is something for you</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Envelope body */}
          <div className="envelope-body" />

          {/* Envelope flap */}
          <div className={`envelope-flap ${isOpen ? 'open' : ''}`} />

          {/* Wax seal */}
          <div className={`wax-seal ${isOpen ? 'hidden' : ''}`}>P</div>
        </div>
      </motion.div>

      {/* Tap to open text */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            className="relative z-10 mt-8 font-sans text-blush-dark/60 text-sm"
            style={{ animation: 'pulse-gentle 2s ease-in-out infinite' }}
          >
            tap to open
          </motion.p>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
          >
            <p className="font-sans text-blush-dark/50 text-xs">scroll down</p>
            <ChevronDown
              className="text-blush-dark/50"
              size={20}
              style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
