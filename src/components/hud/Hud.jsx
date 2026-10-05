/* eslint-disable react/prop-types */
// HUD kit — reusable techwear primitives drawn from the moodboard:
// cut-corner plates, barcode/serial tags, mono labels, dial gauges, waveforms, reticle brackets.
import './hud.css'

const monoFont = { fontFamily: 'MartianMono, monospace' }

// Angular cut-corner plate — the base card for the techwear pages.
export function HudPlate({ as: Tag = 'div', className = '', accent = false, children, ...rest }) {
  return (
    <Tag
      className={`hud-plate relative bg-[#111] ${accent ? 'hud-plate--accent' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Uppercase letter-spaced monospace caption.
export function MonoLabel({ className = '', children }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-[0.22em] ${className}`}
      style={monoFont}
    >
      {children}
    </span>
  )
}

// Barcode + serial strip.
export function BarcodeStrip({ serial = 'S/N 48-1508F', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span aria-hidden className="hud-barcode h-6 flex-1" />
      <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#8a8a8a]" style={monoFont}>
        {serial}
      </span>
    </div>
  )
}

// Small serial / code tag pill.
export function SerialTag({ children, tone = 'orange', className = '' }) {
  const color = tone === 'red' ? '#ff0000' : '#ff5a00'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${className}`}
      style={{ ...monoFont, borderColor: `${color}55`, color }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rotate-45" style={{ background: color }} />
      {children}
    </span>
  )
}

// Circular progress dial with a center readout.
export function Dial({ value = 100, size = 96, label = '', sub = '', accent = '#ff5a00' }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  const dash = (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" height={size} width={size}>
        <circle cx={size / 2} cy={size / 2} fill="none" r={r} stroke="#2a2a2a" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={r}
          stroke={accent}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-[18px] font-bold leading-none text-white" style={{ fontFamily: 'Azonix, sans-serif' }}>
          {label}
        </span>
        {sub && (
          <span className="mt-1 text-[8px] uppercase tracking-[0.15em] text-[#8a8a8a]" style={monoFont}>
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}

// Audio-style waveform bar row.
export function Waveform({ bars = 48, className = '', accent = '#ff5a00' }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const n = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))
    return 20 + Math.round(n * 80)
  })
  return (
    <div className={`flex h-8 items-center gap-[3px] ${className}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          className="w-[3px] shrink-0 rounded-full"
          key={i}
          style={{ height: `${h}%`, background: accent, opacity: 0.35 + (h / 100) * 0.65 }}
        />
      ))}
    </div>
  )
}

// Corner reticle brackets that frame any content.
export function HudBrackets({ className = '', color = '#8a8a8a' }) {
  const corner = 'absolute h-4 w-4 border-[#8a8a8a]'
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={{ color }}>
      <span className={`${corner} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${corner} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-2 right-2 border-b-2 border-r-2`} />
    </div>
  )
}
