import { Link, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { BarcodeStrip, Dial, HudBrackets, HudPlate, MonoLabel, SerialTag, Waveform } from '../components/hud/Hud'
import { getProject, projects } from '../data/projects'

const interFont = { fontFamily: "'Inter', sans-serif" }
const azonix = { fontFamily: 'Azonix, sans-serif' }
const mono = { fontFamily: 'MartianMono, monospace' }

function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProject(slug)

  if (!project) {
    return <Navigate replace to="/projects" />
  }

  // the next four in catalog order, wrapping round to the start
  const at = projects.indexOf(project)
  const others = [1, 2, 3, 4].map((step) => projects[(at + step) % projects.length])
  const hasBrief = Boolean(project.problem) || project.highlights.length > 0

  return (
    <PageShell code={project.serial} crumb={project.name}>
      {/* Hero */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <SerialTag>{project.status}</SerialTag>
            {project.year && <MonoLabel className="text-[#5a5a5a]">{project.year}</MonoLabel>}
          </div>
          <MonoLabel className="mt-6 block text-[#ff5a00]">{project.kicker}</MonoLabel>
          <h1 className="mt-2 text-[clamp(40px,7vw,88px)] uppercase leading-[0.92] text-white" style={azonix}>
            {project.name}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#c4c4c4]" style={interFont}>
            {project.summary}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.link && (
              <a className="rounded-full bg-[#ff5a00] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-black transition-transform hover:scale-105" href={project.link} rel="noreferrer" style={interFont} target="_blank">
                Visit live ›
              </a>
            )}
            {project.repo && (
              <a className="rounded-full border border-[#3a3a3a] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-[#d6d6d6] transition-colors hover:border-[#ff5a00] hover:text-[#ff5a00]" href={project.repo} rel="noreferrer" style={interFont} target="_blank">
                Source
              </a>
            )}
          </div>
        </div>

        <HudPlate accent className="relative overflow-hidden p-3">
          <HudBrackets />
          {project.cover ? (
            <img alt={`${project.name} preview`} className="h-full min-h-[280px] w-full rounded-[8px] object-cover" src={project.cover} />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center">
              <span className="text-[64px] uppercase text-[#242424]" style={azonix}>
                {project.name.slice(0, 2)}
              </span>
            </div>
          )}
        </HudPlate>
      </div>

      {/* Metrics dials — only for projects that have real numbers */}
      {project.metrics.length > 0 && (
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <HudPlate className="flex items-center gap-4 p-5" key={metric.label}>
              <Dial label={metric.value} size={72} value={100} />
              <span className="text-[12px] uppercase leading-snug tracking-[0.1em] text-[#b0b0b0]" style={mono}>
                {metric.label}
              </span>
            </HudPlate>
          ))}
        </div>
      )}

      {/* Problem + highlights */}
      {hasBrief && (
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {project.problem && (
            <div>
              <MonoLabel className="text-[#ff5a00]">THE BRIEF</MonoLabel>
              <p className="mt-4 text-[15px] leading-relaxed text-[#c4c4c4]" style={interFont}>
                {project.problem}
              </p>
              <Waveform className="mt-6 w-full" />
            </div>
          )}
          {project.highlights.length > 0 && (
            <div>
              <MonoLabel className="text-[#ff5a00]">WHAT I BUILT</MonoLabel>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((item) => (
                  <li className="flex gap-3 text-[14px] leading-relaxed text-[#c4c4c4]" key={item} style={interFont}>
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#ff5a00]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Stack */}
      <div className="mt-14">
        <MonoLabel className="text-[#5a5a5a]">STACK</MonoLabel>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {project.stack.map((tech) => (
            <span className="rounded-[6px] border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[12px] uppercase tracking-[0.1em] text-[#d6d6d6]" key={tech} style={mono}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Other projects */}
      <div className="mt-16">
        <BarcodeStrip className="mb-6" serial="NEXT SPECIMEN" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {others.map((other) => (
            <HudPlate as={Link} className="group flex items-center justify-between p-5 transition-transform hover:-translate-y-1" key={other.slug} to={`/projects/${other.slug}`}>
              <div>
                <MonoLabel className="text-[#ff5a00]">{other.serial}</MonoLabel>
                <p className="mt-1 text-[20px] uppercase text-white" style={azonix}>
                  {other.name}
                </p>
              </div>
              <span className="text-[#ff5a00] transition-transform group-hover:translate-x-1" style={mono}>
                ›
              </span>
            </HudPlate>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

export default ProjectDetailPage
