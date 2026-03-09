import { useState } from 'react'
import FloatingPetals from '@components/flowers/FloatingPetals'
import ScrollProgress from '@components/ui/ScrollProgress'
import HeroEnvelope from '@components/sections/HeroEnvelope'
import FlowerGarden from '@components/sections/FlowerGarden'
import AnnoyReasons from '@components/sections/AnnoyReasons'
import InteractiveQuiz from '@components/sections/InteractiveQuiz'
import MoonSection from '@components/sections/MoonSection'
import BirthdayWishes from '@components/sections/BirthdayWishes'
import FinalMessage from '@components/sections/FinalMessage'

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false)

  return (
    <div className="relative">
      {envelopeOpened && <ScrollProgress />}
      <FloatingPetals />
      <HeroEnvelope onOpen={() => setEnvelopeOpened(true)} />
      {envelopeOpened && (
        <>
          <FlowerGarden />
          <AnnoyReasons />
          <InteractiveQuiz />
          <MoonSection />
          <BirthdayWishes />
          <FinalMessage />
        </>
      )}
    </div>
  )
}
