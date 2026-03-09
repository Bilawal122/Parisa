import { motion } from 'framer-motion'
import { memories } from '@data/memories'

function TimelineNode({ memory, index }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className={`relative flex items-center mb-12 sm:mb-16 ${
        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
      } flex-row`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'} pl-12 sm:pl-0`}>
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-blush/10 border border-blush-light/40">
          {/* Date badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold font-sans text-xs font-semibold mb-3">
            {memory.date}
          </span>

          {/* Emoji */}
          <div className="text-4xl mb-3">{memory.emoji}</div>

          {/* Caption */}
          <p className="font-sans text-charcoal/80 text-base leading-relaxed">
            {memory.caption}
          </p>
        </div>
      </div>

      {/* Timeline dot */}
      <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full bg-blush border-4 border-cream shadow-md z-10" />

      {/* Spacer for opposite side */}
      <div className="hidden sm:block flex-1" />
    </motion.div>
  )
}

export default function MemoryTimeline() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{
      background: 'linear-gradient(180deg, #FFF8F0 0%, #FDE2EF20 50%, #FFF8F0 100%)'
    }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-bold mb-3">
            Our Story So Far
          </h2>
          <p className="font-script text-xl sm:text-2xl text-blush-dark">
            A collection of moments I'll never forget
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-2.5 sm:left-1/2 sm:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-blush/30"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Nodes */}
          {memories.map((memory, i) => (
            <TimelineNode key={i} memory={memory} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
