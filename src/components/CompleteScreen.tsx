import type { ThemeTokens } from '../types'

type CompleteScreenProps = {
  known: number
  reviewed: number
  theme: ThemeTokens
  onRestart: () => void
  onChangeLevel?: () => void
}

export function CompleteScreen({
  known,
  reviewed,
  theme,
  onRestart,
  onChangeLevel,
}: CompleteScreenProps) {
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
          color: theme.sub,
          fontSize: 15,
          marginBottom: 28,
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        You marked{' '}
        <b style={{ color: theme.text }}>{known}</b> word
        {known === 1 ? '' : 's'} as known
        {reviewed > 0 && (
          <>
            {' '}and reviewed{' '}
            <b style={{ color: theme.text }}>{reviewed}</b> tricky one
            {reviewed === 1 ? '' : 's'}
          </>
        )}
        .
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <button
          onClick={onRestart}
          style={{
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
          }}
        >
          Start a new round
        </button>
        {onChangeLevel && (
          <button
            onClick={onChangeLevel}
            style={{
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
            }}
          >
            Change level
          </button>
        )}
      </div>
    </div>
  )
}
