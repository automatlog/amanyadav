import { MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'
import AboutLayer from './home/AboutLayer'
import ContactLayer from './home/ContactLayer'
import ExperienceLayer from './home/ExperienceLayer'
import NavLayer from './home/NavLayer'
import ProjectsLayer from './home/ProjectsLayer'
import SkillsLayer from './home/SkillsLayer'
import { Section, StageContext } from './home/canvas'
import { markIntroPlayed, peekIntro } from './home/intro'
import './home/home.css'

/**
 * Home — the Figma frame "Home" (1440 x 3427.55), reproduced as the flex
 * auto-layout the design actually uses: a centred column with 28px padding
 * and a 134px gap. Section sizes are the Figma group sizes, so the vertical
 * rhythm falls out of the layout instead of being hand-computed.
 *
 * Stacking the six groups with that padding and gap reproduces the frame's
 * stated 3427.55 height exactly.
 */
function HomePage() {
  /* the staged entrance, decided once for this mount (see home/intro.js) */
  const [intro] = useState(peekIntro)
  useEffect(() => {
    markIntroPlayed()
  }, [])

  return (
    /* reducedMotion="user": framer drops the sections' 30px rise for anyone
       with reduced motion set, and keeps only the opacity fade. */
    <MotionConfig reducedMotion="user">
      <StageContext.Provider value={intro}>
        <div className="hm-scroll">
          <div className="hm-root">
            {/* First Tab stop — jumps past the nav straight to the content. It
                lives inside .hm-root because that is where --u is defined. */}
            <a className="hm-skip" href="#whoami">
              Skip to content
            </a>

            {/* The first screen stages itself in four steps — navbar logo,
                navbar, status, hero card — so these two skip the scroll reveal
                the sections below use. */}
            <Section h={174} reveal={false} w={1229}>
              <NavLayer />
            </Section>

            <Section h={477} id="whoami" reveal={false} w={1229}>
              <AboutLayer />
            </Section>

            <Section h={595.05} id="experience" w={1259.5}>
              <ExperienceLayer />
            </Section>

            {/* The export calls this group 1340 wide, which centred it with a 50
                gutter either side — so the conduit stopped 50 short of the frame
                edge and, because the housing is flush to the group's RIGHT edge,
                the device itself sat 51 right of centre. Giving the group the
                frame's full 1440 keeps every exported coordinate untouched and
                fixes both: the conduit now runs off the left edge, and the
                housing's centre lands on 720.99 against the frame's 720. */}
            <Section h={831.5} id="projects" w={1440}>
              <ProjectsLayer />
            </Section>

            <Section h={260} id="skills" w={1444}>
              <SkillsLayer />
            </Section>

            <Section h={315} id="contact" w={1294}>
              <ContactLayer />
            </Section>
          </div>

          <div aria-hidden className="hm-grain" />
        </div>
      </StageContext.Provider>
    </MotionConfig>
  )
}

export default HomePage
