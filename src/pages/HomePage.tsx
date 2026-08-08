import { Hero } from '@/components/sections/Hero';
import { VisionExperience } from '@/components/sections/VisionExperience';
import { About } from '@/components/sections/About';
import { WhyUs } from '@/components/sections/WhyUs';
import { FaceShapeGuide } from '@/components/sections/FaceShapeGuide';
import { Products } from '@/components/sections/Products';
import { FrameShowcase } from '@/components/sections/FrameShowcase';
import { LensTechnology } from '@/components/sections/LensTechnology';
import { BeforeAfterVision } from '@/components/sections/BeforeAfterVision';
import { EyeTestJourney } from '@/components/sections/EyeTestJourney';
import { Appointment } from '@/components/sections/Appointment';
import { Reviews } from '@/components/sections/Reviews';
import { Owner } from '@/components/sections/Owner';
import { Instagram } from '@/components/sections/Instagram';
import { Location } from '@/components/sections/Location';
import { Contact } from '@/components/sections/Contact';
import { FAQ } from '@/components/sections/FAQ';
import { GrandFinale } from '@/components/sections/GrandFinale';
import { LensReveal } from '@/components/ui/LensReveal';

/** The homepage — the original scroll experience, untouched. */
export function HomePage() {
  return (
    <main>
      {/* Outside World -> Entering Bajaj Optics */}
      <Hero />

      {/* The site's thesis, made physical: blur resolves into clarity */}
      <VisionExperience />

      {/* The lens-travel moment: we emerge inside the studio */}
      <LensReveal id="about-portal" startRadius={3}>
        <About />
      </LensReveal>

      <WhyUs />

      {/* Find your frame */}
      <FaceShapeGuide />

      {/* Looking at Frames */}
      <Products />
      <FrameShowcase />
      <LensTechnology />
      <BeforeAfterVision />

      {/* Eye Testing */}
      <EyeTestJourney />

      {/* Happy Customer -> Book Appointment, via a second, quieter lens moment */}
      <LensReveal id="appointment-portal" startRadius={8}>
        <Appointment />
      </LensReveal>

      <Reviews />
      <Owner />
      <Instagram />

      {/* Visit Store */}
      <Location />
      <Contact />

      <FAQ />
      <GrandFinale />
    </main>
  );
}
