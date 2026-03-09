import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TurtleFlower from '@components/flowers/TurtleFlower'

const flowers = [
  {
    type: 'spiral-rose',
    label: 'Kind',
    colors: ['#F2B5D4', '#D4849B', '#e8a0c0'],
    delay: 0,
  },
  {
    type: 'lotus',
    label: 'Beautiful',
    colors: ['#D4849B', '#C4917B', '#F2B5D4'],
    delay: 0.5,
  },
  {
    type: 'fibonacci',
    label: 'Brilliant',
    colors: ['#D4A853', '#C4917B', '#e6bc5e'],
    delay: 1.0,
  },
  {
    type: 'maurer',
    label: 'Hilarious',
    colors: ['#A8C5A0', '#7BA376', '#F2B5D4'],
    delay: 1.5,
  },
  {
    type: 'sunburst',
    label: 'Stubborn\n(in a cute way)',
    colors: ['#C4917B', '#D4849B', '#D4A853'],
    delay: 2.0,
  },
  {
    type: 'spirograph',
    label: 'One of a kind',
    colors: ['#F2B5D4', '#D4A853', '#C4917B'],
    delay: 2.5,
  },
]

export default function FlowerGarden() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const flowerSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 200

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #D4E7D0 30%, #D4E7D0 70%, #FFF8F0 100%)' }}
    >
      {/* Title */}
      <motion.div
        className="text-center mb-10 sm:mb-14 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-bold mb-3">
          A Garden for You
        </h2>
        <p className="font-script text-xl sm:text-2xl text-sage-dark">
          Every flower represents something about you
        </p>
      </motion.div>

      {/* Flowers */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 max-w-6xl mx-auto px-4">
        {inView && flowers.map((flower, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: flower.delay * 0.4, duration: 0.6, type: 'spring' }}
          >
            <TurtleFlower
              type={flower.type}
              colors={flower.colors}
              label={flower.label}
              size={flowerSize}
              delay={flower.delay}
            />
          </motion.div>
        ))}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sage/30 to-transparent" />
    </section>
  )
}
