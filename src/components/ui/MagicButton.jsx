import { motion } from 'framer-motion'

export default function MagicButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-10 py-4 rounded-full font-serif text-lg sm:text-xl text-white
                  bg-gradient-to-r from-blush via-rose-gold to-blush
                  cursor-pointer border-none outline-none
                  ${className}`}
      style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
