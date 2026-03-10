import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConfetti } from '@hooks/useConfetti'
import MagicButton from '@components/ui/MagicButton'
import LetterFlowers from '@components/flowers/LetterFlowers'
import { Heart, Music, VolumeX } from 'lucide-react'

export default function FinalMessage() {
  const [wishMade, setWishMade] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const { triggerFinale } = useConfetti()
  const sectionRef = useRef(null)

  const handleWish = () => {
    if (wishMade) return
    setWishMade(true)
    triggerFinale()

    // Start music
    if (audioRef.current) {
      audioRef.current.volume = 0.4
      audioRef.current.play().then(() => {
        setMusicPlaying(true)
      }).catch(() => {
        // Autoplay blocked, that's ok
      })
    }

    setTimeout(() => {
      setShowLetter(true)
    }, 1800)
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setMusicPlaying(!musicPlaying)
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 sm:py-24 bg-cream overflow-hidden px-4"
    >
      {/* Background audio - user should replace src with their song */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {/* Music toggle button */}
      {wishMade && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-blush/30
                     flex items-center justify-center cursor-pointer shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {musicPlaying ? (
            <Music className="text-blush-dark" size={18} />
          ) : (
            <VolumeX className="text-charcoal/40" size={18} />
          )}
        </motion.button>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(242,181,212,0.08) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {!wishMade ? (
          /* Pre-wish: Make a Wish button */
          <motion.div
            className="min-h-screen flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="text-blush mb-6" size={36} fill="#F2B5D4" />
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-bold mb-4 leading-tight">
              And for the main part
            </h2>
            <p className="font-sans text-charcoal/60 text-base sm:text-lg mb-10 max-w-md">
              Just make a wish and click the obvious button (don't miss it)
            </p>
            <MagicButton onClick={handleWish}>
              Yes click here please ✨
            </MagicButton>
          </motion.div>
        ) : (
          /* Post-wish: Letter + Photo */
          showLetter && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="py-8"
            >
              {/* Decorative canvas flowers */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <LetterFlowers width={Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 32 : 600)} height={140} />
              </motion.div>

              {/* Letter + Photo layout */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
                {/* Photo side */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <div className="relative">
                    <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl shadow-blush/20 border-4 border-white">
                      <img
                        src="/photos/parisa.jpg"
                        alt="Parisa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if no photo yet
                          e.target.style.display = 'none'
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blush-light', 'to-blush')
                          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><span class="font-script text-4xl text-white/80">P</span></div>'
                        }}
                      />
                    </div>
                    {/* Decorative tape effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-gold/30 rounded-sm -rotate-2" />
                  </div>
                </motion.div>

                {/* Letter side */}
                <motion.div
                  className="flex-1 max-w-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <div
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-blush/10 border border-blush-light/40"
                    style={{
                      backgroundImage: 'linear-gradient(transparent 95%, rgba(242,181,212,0.15) 95%)',
                      backgroundSize: '100% 2rem',
                    }}
                  >
                    <p className="font-script text-xl sm:text-2xl text-gold mb-4">Dear Parisa,</p>

                    <div className="font-sans text-charcoal/75 text-sm sm:text-base leading-[2rem] space-y-4">
                      <p>
                        Happy birthday precious. Words really cannot describe what you deserve. You are an amazing friend. You are one of the only one who is so real in a world full of fakes and I have always loved that about you and its my favorite thing about you. Please keep being real and genuine. So dont change except maybe your sleep schedule.
                      </p>
                      <p>
                        One year back, when I met you in the gc, I had no idea we'd ever be this close friends but damn we never know where life brings us. Im not complaining as you are one of the best friends I have made in the past year.
                      </p>
                      <p>
                        You're kind, beautiful, dumb, slow, pretty, genuine, dumass, brilliant and so many words that I can say and won't be enough.
                      </p>
                      <p>
                        I am not good with words so I'll just say, Happy birthday Parisa and I hope you enjoyed your little gift and I hope you have many more.
                      </p>
                      <p className="font-medium text-charcoal/90">
                        Also noone is beating my gift for a while so yeah. Keep smiling precious, it suits you.
                      </p>
                    </div>

                    <div className="mt-6 text-right">
                      <p className="font-script text-lg sm:text-xl text-blush-dark">
                        Made by your favourite manipulator
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom decorative flowers */}
              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                <LetterFlowers width={Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 32 : 600)} height={120} />
              </motion.div>

              {/* Footer */}
              <motion.div
                className="text-center mt-8 sm:mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <p className="font-script text-2xl sm:text-4xl text-gold mb-3">
                  Happy Birthday, Parisa
                </p>
                <Heart className="text-blush mx-auto mb-4" size={24} fill="#F2B5D4" />
                <p className="font-sans text-charcoal/30 text-xs">
                  made by your favourite manipulator
                </p>
              </motion.div>
            </motion.div>
          )
        )}
      </div>
    </section>
  )
}
