/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { BarcodeStrip, HudBrackets, HudPlate, MonoLabel, SerialTag } from '../components/hud/Hud'
import { projects } from '../data/projects'

function CoverArt({ project }) {
  if (project.cover) {
    return (
      <img
        alt={`${project.name} preview`}
        className="h-44 w-full rounded-[10px] object-cover"
        loading="lazy"
        src={project.cover}
      />
    )
  }
  return (
    <div className="relative flex h-44 w-full items-center justify-center rounded-[10px] border border-[#1c1c1c] bg-[radial-gradient(circle_at_center,#161616,#0c0c0c)]">
      <HudBrackets />
      <span className="text-[40px] uppercase text-[#2f2f2f]" style={{ fontFamily: 'Azonix, sans-serif' }}>
        {project.name.slice(0, 2)}
      </span>
    </div>
  )
}

function ProjectsIndexPage() {
  return (
    <PageShell code="INDEX · PRJ" crumb="Projects" title="Projects">
      <p className="max-w-2xl text-[14px] leading-relaxed text-[#b0b0b0]" style={{ fontFamily: "'Inter', sans-serif" }}>
        Selected build and design work — each specimen catalogued. Open one for the full case file.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <HudPlate as={Link} className="group block p-5 transition-transform hover:-translate-y-1" key={project.slug} to={`/projects/${project.slug}`}>
            <div className="mb-4 flex items-center justify-between">
              <SerialTag>{project.serial}</SerialTag>
              <MonoLabel className="text-[#5a5a5a]">{project.status}</MonoLabel>
            </div>

            <CoverArt project={project} />

            <MonoLabel className="mt-5 block text-[#ff5a00]">{project.kicker}</MonoLabel>
            <h2 className="mt-2 text-[26px] uppercase leading-none text-white" style={{ fontFamily: 'Azonix, sans-serif' }}>
              {project.name}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#b0b0b0]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {project.tagline}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.roles.map((role) => (
                <span className="rounded-full border border-[#2a2a2a] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8a8a8a]" key={role} style={{ fontFamily: 'MartianMono, monospace' }}>
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#1c1c1c] pt-4">
              <MonoLabel className="text-[#5a5a5a]">{project.year}</MonoLabel>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#ff5a00] transition-transform group-hover:translate-x-1" style={{ fontFamily: 'MartianMono, monospace' }}>
                Open ›
              </span>
            </div>
          </HudPlate>
        ))}
      </div>

      <BarcodeStrip className="mt-12" serial={`${projects.length} SPECIMENS CATALOGUED`} />
    </PageShell>
  )
}

export default ProjectsIndexPage
