import { useEffect, useMemo, useRef, useState } from 'react'
import type { Level, ThemeTokens } from '../types'

type WordCountModalProps = {
  level: Level
  theme: ThemeTokens
  poolSize: number
  initialValue: number
  minValue?: number
  maxValue?: number
  onCancel: () => void
  onConfirm: (count: number) => void
}

const PRESETS = [5, 10, 20, 30]

export function WordCountModal({
  level,
  theme,
  poolSize,
  initialValue,
  minValue = 1,
  maxValue,
  onCancel,
  onConfirm,
}: WordCountModalProps) {
  const hardMax = useMemo(
    () => Math.max(minValue, Math.min(maxValue ?? poolSize, poolSize)),
    [minValue, maxValue, poolSize],
  )
  const clamp = (v: number) => Math.max(minValue, Math.min(hardMax, v))
  const [value, setValue] = useState(() => clamp(initialValue))
  const [text, setText] = useState(String(clamp(initialValue)))
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setText(String(value))
  }, [value])

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  const submit = () => {
    onConfirm(clamp(value))
  }

  const availablePresets = PRESETS.filter((p) => p <= hardMax)
  if (availablePresets.length === 0 || availablePresets[availablePresets.length - 1] !== hardMax) {
    availablePresets.push(hardMax)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Choose how many ${level} words to play`}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 12, 4, 0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '20px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        zIndex: 200,
        animation: 'wcm-fade 200ms ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <style>{`
        @keyframes wcm-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wcm-rise { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: theme.bg,
          color: theme.text,
          borderRadius: 28,
          padding: 24,
          paddingBottom: 22,
          boxShadow:
            '0 30px 80px -20px rgba(20, 12, 4, 0.5), 0 4px 14px rgba(20, 12, 4, 0.12)',
          fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
          animation: 'wcm-rise 260ms cubic-bezier(.4,.0,.2,1)',
          marginBottom: 'auto',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: theme.sub,
              }}
            >
              {level} · {poolSize} words available
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginTop: 4,
                lineHeight: 1.15,
              }}
            >
              How many to play?
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            style={{
              appearance: 'none',
              border: 0,
              background: theme.chip,
              color: theme.text,
              width: 34,
              height: 34,
              borderRadius: 99,
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => setValue((v) => clamp(v - 1))}
            style={stepBtn(theme)}
          >
            −
          </button>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={minValue}
            max={hardMax}
            value={text}
            onChange={(e) => {
              const raw = e.target.value
              setText(raw)
              const n = Number(raw)
              if (Number.isFinite(n)) setValue(clamp(Math.round(n)))
            }}
            onBlur={() => setText(String(value))}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: "'Fraunces', serif",
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              padding: '12px 0',
              borderRadius: 18,
              background: theme.chip,
              color: theme.text,
              border: '0',
              outline: 'none',
              fontVariantNumeric: 'tabular-nums',
              MozAppearance: 'textfield',
            }}
          />
          <button
            type="button"
            aria-label="Increase"
            onClick={() => setValue((v) => clamp(v + 1))}
            style={stepBtn(theme)}
          >
            +
          </button>
        </div>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {availablePresets.map((p) => {
            const active = p === value
            return (
              <button
                key={p}
                type="button"
                onClick={() => setValue(clamp(p))}
                style={{
                  appearance: 'none',
                  border: 0,
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 700,
                  background: active ? theme.btnBg : theme.chip,
                  color: active ? theme.btnText : theme.text,
                  fontFamily: 'inherit',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p === hardMax && p !== Math.min(...PRESETS) ? `Max · ${p}` : p}
              </button>
            )
          })}
        </div>

        <input
          type="range"
          min={minValue}
          max={hardMax}
          value={value}
          onChange={(e) => setValue(clamp(Number(e.target.value)))}
          style={{
            width: '100%',
            marginTop: 18,
            accentColor: theme.progressFill,
          }}
        />

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              appearance: 'none',
              border: 0,
              background: theme.chip,
              color: theme.text,
              padding: '14px 0',
              borderRadius: 99,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 2,
              appearance: 'none',
              border: 0,
              background: theme.btnBg,
              color: theme.btnText,
              padding: '14px 0',
              borderRadius: 99,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Start {value} {value === 1 ? 'card' : 'cards'}
          </button>
        </div>
      </form>
    </div>
  )
}

function stepBtn(theme: ThemeTokens) {
  return {
    appearance: 'none' as const,
    border: 0,
    background: theme.chip,
    color: theme.text,
    width: 48,
    height: 48,
    borderRadius: 99,
    fontSize: 22,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
  }
}
