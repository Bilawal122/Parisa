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

/* Gradient dividers for smooth transitions between light ↔ dark sections */
const DividerToDark = () => (
  <div className="h-20 sm:h-28" style={{
    background: 'linear-gradient(180deg, #FFF8F0 0%, #1A1A2E 100%)'
  }} />
)
const DividerToLight = () => (
  <div className="h-20 sm:h-28" style={{
    background: 'linear-gradient(180deg, #1A1A2E 0%, #FFF8F0 100%)'
  }} />
)
const DividerDarkToDark = () => (
  <div className="h-16 sm:h-20" style={{
    background: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #1A1A2E 100%)'
  }} />
)

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
          <DividerToDark />
          <AnnoyReasons />
          <DividerToLight />
          <InteractiveQuiz />
          <DividerToDark />
          <MoonSection />
          <DividerDarkToDark />
          <BirthdayWishes />
          <DividerToLight />
          <FinalMessage />
        </>
      )}
    </div>
  )
}
