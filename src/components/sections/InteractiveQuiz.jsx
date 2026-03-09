import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfetti } from '@hooks/useConfetti'
import { quizQuestions } from '@data/quizQuestions'
import { Sparkles, PartyPopper } from 'lucide-react'

export default function InteractiveQuiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResponse, setShowResponse] = useState(false)
  const [finished, setFinished] = useState(false)
  const { triggerConfetti } = useConfetti()

  const question = quizQuestions[current]

  const handleAnswer = (index) => {
    if (selected !== null) return
    setSelected(index)
    setShowResponse(true)

    if (index === question.correct) {
      setScore(s => s + 1)
      triggerConfetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } })
    }

    setTimeout(() => {
      if (current < quizQuestions.length - 1) {
        setCurrent(c => c + 1)
        setSelected(null)
        setShowResponse(false)
      } else {
        setFinished(true)
      }
    }, 2200)
  }

  const getResultMessage = () => {
    const pct = score / quizQuestions.length
    if (pct === 1) return "Perfect score! You know the deal."
    if (pct >= 0.6) return "Pretty good! You're clearly paying attention."
    return "We need to hang out more... for research purposes."
  }

  return (
    <section className="relative py-20 sm:py-28 bg-cream overflow-hidden">
      <div className="max-w-2xl mx-auto px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-bold mb-3">
            The Parisa Quiz
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush-dark">
            Let's see how this goes...
          </p>
        </motion.div>

        {/* Quiz Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
              >
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-sm text-charcoal/40">
                    {current + 1} of {quizQuestions.length}
                  </span>
                  <div className="flex gap-1.5">
                    {quizQuestions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          i < current ? 'bg-gold' : i === current ? 'bg-blush' : 'bg-charcoal/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-blush/10 border border-blush-light/50 mb-6">
                  <Sparkles className="text-gold mb-3" size={24} />
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal leading-relaxed">
                    {question.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const isCorrect = i === question.correct
                    const isSelected = i === selected
                    let bgClass = 'bg-white hover:bg-blush-light/30 border-blush-light/30'
                    if (selected !== null) {
                      if (isCorrect) bgClass = 'bg-gold/20 border-gold'
                      else if (isSelected) bgClass = 'bg-red-50 border-red-200'
                    }

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-colors duration-300
                                    font-sans text-base sm:text-lg text-charcoal cursor-pointer
                                    disabled:cursor-default ${bgClass}`}
                        animate={
                          selected !== null && isSelected && !isCorrect
                            ? { x: [0, -8, 8, -8, 8, 0] }
                            : {}
                        }
                        transition={{ duration: 0.4 }}
                        whileHover={selected === null ? { scale: 1.02 } : {}}
                        whileTap={selected === null ? { scale: 0.98 } : {}}
                      >
                        <span className="font-medium text-blush-dark/50 mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {option}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Response */}
                <AnimatePresence>
                  {showResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-blush-light/50 border border-blush/30"
                    >
                      <p className="font-sans text-charcoal/80 text-center italic">
                        {question.response}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center py-8"
              >
                <PartyPopper className="text-gold mx-auto mb-4" size={48} />
                <h3 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold mb-2">
                  {score} / {quizQuestions.length}
                </h3>
                <p className="font-script text-xl sm:text-2xl text-blush-dark mb-4">
                  {getResultMessage()}
                </p>
                <motion.button
                  onClick={() => {
                    setCurrent(0)
                    setSelected(null)
                    setShowResponse(false)
                    setScore(0)
                    setFinished(false)
                  }}
                  className="font-sans text-sm text-blush-dark/60 underline cursor-pointer bg-transparent border-none"
                  whileHover={{ scale: 1.05 }}
                >
                  try again?
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
