import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlipCard({ front, back, index }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className="perspective-1000 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-64 sm:h-72 transition-transform duration-700 transform-style-3d"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-white/5 border border-blush/30 backdrop-blur-sm flex items-center justify-center p-6">
          <p className="font-serif text-lg sm:text-xl text-blush-light text-center leading-relaxed">
            {front}
          </p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-blush to-rose-gold flex items-center justify-center p-6">
          <p className="font-sans text-base sm:text-lg text-charcoal text-center font-medium leading-relaxed">
            {back}
          </p>
        </div>
      </div>
      <p className="text-center text-blush/40 text-xs mt-3 font-sans">
        {isFlipped ? 'tap to flip back' : 'tap to reveal'}
      </p>
    </motion.div>
  )
}
