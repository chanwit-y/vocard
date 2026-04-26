import type { ThemeTokens } from '../types'

type PillProps = {
  theme: ThemeTokens
  icon: string
  value: number
  label: string
  pulse: boolean
  accent: string
}

export function Pill({ theme, icon, value, label, pulse, accent }: PillProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        borderRadius: 99,
        background: theme.pillBg,
        border: `1px solid ${theme.pillBorder}`,
        fontSize: 13,
        fontWeight: 700,
        color: theme.text,
        transition: 'transform 200ms',
        transform: pulse ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      <span style={{ color: accent, fontSize: 12, fontWeight: 800 }}>
        {icon}
      </span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span
        className="pill-label"
        style={{ color: theme.sub, fontWeight: 600, fontSize: 11 }}
      >
        {label}
      </span>
    </div>
  )
}

type SwipeHintProps = {
  theme: ThemeTokens
  color: string
  arrow: string
  label: string
  sub: string
  align?: 'left' | 'right'
}

export function SwipeHint({
  theme,
  color,
  arrow,
  label,
  sub,
  align = 'left',
}: SwipeHintProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 1,
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color,
          fontWeight: 800,
          fontSize: 'clamp(11px, 3.4vw, 13px)',
          whiteSpace: 'nowrap',
        }}
      >
        {align !== 'right' && (
          <span style={{ fontSize: 'clamp(13px, 4.2vw, 16px)' }}>{arrow}</span>
        )}
        <span>{label}</span>
        {align === 'right' && (
          <span style={{ fontSize: 'clamp(13px, 4.2vw, 16px)' }}>{arrow}</span>
        )}
      </div>
      <span
        style={{
          color: theme.sub,
          fontSize: 'clamp(10px, 2.9vw, 11px)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {sub}
      </span>
    </div>
  )
}

export function DoubleTapHint({ theme }: { theme: ThemeTokens }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: theme.text,
          opacity: 0.85,
          fontWeight: 700,
          fontSize: 'clamp(11px, 3.4vw, 13px)',
          whiteSpace: 'nowrap',
        }}
      >
        <DoubleTapIcon color={theme.text} />
        <span>Flip</span>
      </div>
      <span
        style={{
          color: theme.sub,
          fontSize: 'clamp(10px, 2.9vw, 11px)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        Double-tap
      </span>
    </div>
  )
}

function DoubleTapIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="2" opacity="0.9" />
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.45"
        strokeDasharray="2 3"
      />
    </svg>
  )
}

export function Logo({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <rect
        x="4"
        y="6"
        width="18"
        height="14"
        rx="3"
        fill={color}
        opacity="0.35"
        transform="rotate(-8 13 13)"
      />
      <rect x="6" y="8" width="18" height="14" rx="3" fill={color} />
      <line
        x1="10"
        y1="13"
        x2="20"
        y2="13"
        stroke="#FFF7EE"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <line
        x1="10"
        y1="17"
        x2="17"
        y2="17"
        stroke="#FFF7EE"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}
