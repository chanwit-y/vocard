import type { CSSProperties } from 'react'
import type { ThemeTokens } from '../types'

type CompleteScreenProps = {
  known: number
  reviewed: number
  theme: ThemeTokens
  onRestart: () => void
  onPracticeReview?: () => void
  onChangeLevel?: () => void
}

export function CompleteScreen({
  known,
  reviewed,
  theme,
  onRestart,
  onPracticeReview,
  onChangeLevel,
}: CompleteScreenProps) {
  const hasReview = reviewed > 0 && Boolean(onPracticeReview)

  const primaryStyle: CSSProperties = {
    appearance: 'none',
    border: 0,
    background: theme.btnBg,
    color: theme.btnText,
    padding: '14px 28px',
    borderRadius: 99,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.01em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const secondaryStyle: CSSProperties = {
    appearance: 'none',
    border: `1.5px solid ${theme.pillBorder}`,
    background: 'transparent',
    color: theme.text,
    padding: '12px 24px',
    borderRadius: 99,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.01em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const linkStyle: CSSProperties = {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    color: theme.sub,
    padding: '6px 14px',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 32,
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 8 }}>🎉</div>
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 32,
          fontWeight: 600,
          color: theme.text,
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}
      >
        Nice work!
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 22,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <SummaryStat
          icon="✓"
          accent="#1F8A4F"
          value={known}
          label={`known`}
          theme={theme}
        />
        <SummaryStat
          icon="↻"
          accent="#C4302B"
          value={reviewed}
          label={`to review`}
          theme={theme}
        />
      </div>

      <div
        style={{
          color: theme.sub,
          fontSize: 14,
          marginBottom: 24,
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        {hasReview ? (
          <>
            You still have{' '}
            <b style={{ color: theme.text }}>{reviewed}</b> tricky word
            {reviewed === 1 ? '' : 's'} to revisit.
          </>
        ) : (
          <>You marked every card as known. Great job!</>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {hasReview ? (
          <>
            <button onClick={onPracticeReview} style={primaryStyle}>
              Practice review ({reviewed})
            </button>
            <button onClick={onRestart} style={secondaryStyle}>
              Start a new round
            </button>
          </>
        ) : (
          <button onClick={onRestart} style={primaryStyle}>
            Start a new round
          </button>
        )}
        {onChangeLevel && (
          <button onClick={onChangeLevel} style={linkStyle}>
            Change level
          </button>
        )}
      </div>
    </div>
  )
}

type SummaryStatProps = {
  icon: string
  accent: string
  value: number
  label: string
  theme: ThemeTokens
}

function SummaryStat({ icon, accent, value, label, theme }: SummaryStatProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 99,
        background: theme.pillBg,
        border: `1px solid ${theme.pillBorder}`,
        color: theme.text,
      }}
    >
      <span style={{ color: accent, fontSize: 13, fontWeight: 800 }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: theme.sub,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  )
}
