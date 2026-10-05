/* eslint-disable react/prop-types */
import PageShell from '../components/PageShell'
import { BarcodeStrip, HudBrackets, HudPlate, MonoLabel, SerialTag, Waveform } from '../components/hud/Hud'
import { achievements } from '../data/achievements'

const interFont = { fontFamily: "'Inter', sans-serif" }
const azonix = { fontFamily: 'Azonix, sans-serif' }
const mono = { fontFamily: 'MartianMono, monospace' }

// Decorative katakana accents, cycled per card for the techwear "specimen" feel.
const katakana = ['データ', 'セキュア', 'デザイン', 'イベント', 'ブランド', 'タイプ']

function AchievementCard({ item, index }) {
  const tall = item.span === 'tall'
  const wide = item.span === 'wide'

  return (
    <HudPlate accent className={`hud-scanline group relative mb-6 break-inside-avoid overflow-hidden p-6 ${wide ? 'lg:col-span-2' : ''}`}>
      <HudBrackets />

      {/* Orange corner wedge */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-[#ff5a00]/20"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />

      <div className="flex items-start justify-between gap-4">
        <SerialTag>{item.code}</SerialTag>
        <span className="text-[22px] leading-none text-[#2f2f2f] transition-colors group-hover:text-[#ff5a00]/40" style={azonix} aria-hidden>
          {katakana[index % katakana.length]}
        </span>
      </div>

      <MonoLabel className="mt-5 block text-[#ff5a00]">{item.kind}</MonoLabel>
      <h2 className={`mt-2 uppercase leading-none text-white ${tall ? 'text-[30px]' : 'text-[24px]'}`} style={azonix}>
        {item.title}
      </h2>
      <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[#8a8a8a]" style={mono}>
        {item.org}
      </p>

      <p className="mt-4 text-[14px] leading-relaxed text-[#c0c0c0]" style={interFont}>
        {item.blurb}
      </p>

      {tall && <Waveform bars={40} className="mt-6 w-full" />}

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span className="rounded-full border border-[#2a2a2a] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#8a8a8a]" key={tag} style={mono}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#1c1c1c] pt-4">
        <div className="flex flex-col gap-1">
          <MonoLabel className="text-[#5a5a5a]">{item.place}</MonoLabel>
          <MonoLabel className="text-[#d6d6d6]">{item.date}</MonoLabel>
        </div>
        {item.link ? (
          <a className="text-[11px] uppercase tracking-[0.2em] text-[#ff5a00] transition-transform hover:translate-x-1" href={item.link} rel="noreferrer" style={mono} target="_blank">
            Visit ›
          </a>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#3a3a3a]" style={mono}>
            Archive
          </span>
        )}
      </div>
    </HudPlate>
  )
}

function AchievementsPage() {
  return (
    <PageShell code="LOG · ACH" crumb="Achievements" title="Achievements">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="max-w-2xl text-[14px] leading-relaxed text-[#b0b0b0]" style={interFont}>
          A wall of community work, CTF events and design drops — every specimen tagged and dated. Cybersecurity
          collectives, developer clubs and the artwork that set the mood.
        </p>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[34px] leading-none text-white" style={azonix}>
              {achievements.length}
            </p>
            <MonoLabel className="text-[#5a5a5a]">ENTRIES</MonoLabel>
          </div>
        </div>
      </div>

      {/* Moodboard wall — masonry columns */}
      <div className="mt-10 gap-6 lg:columns-2 xl:columns-3 [&>*]:break-inside-avoid">
        {achievements.map((item, index) => (
          <AchievementCard index={index} item={item} key={item.code} />
        ))}
      </div>

      <BarcodeStrip className="mt-8" serial="END OF LOG · AUTOMATLOG" />
    </PageShell>
  )
}

export default AchievementsPage
