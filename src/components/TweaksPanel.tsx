import {
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import './TweaksPanel.css'

type RadioOption<V extends string> = { label: string; value: V }

type TweaksPanelProps = PropsWithChildren<{
  title?: string
  dark?: boolean
}>

export function TweaksPanel({
  title = 'Tweaks',
  dark = false,
  children,
}: TweaksPanelProps) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        className="twk-fab"
        data-dark={dark ? '1' : '0'}
        aria-label="Open tweaks"
        onClick={() => setOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M19.4 13.7a7.8 7.8 0 0 0 0-3.4l2-1.6-2-3.4-2.4.8a7.7 7.7 0 0 0-2.9-1.7L13.6 2h-3.2l-.5 2.4a7.7 7.7 0 0 0-2.9 1.7l-2.4-.8-2 3.4 2 1.6a7.8 7.8 0 0 0 0 3.4l-2 1.6 2 3.4 2.4-.8a7.7 7.7 0 0 0 2.9 1.7l.5 2.4h3.2l.5-2.4a7.7 7.7 0 0 0 2.9-1.7l2.4.8 2-3.4-2-1.6Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )
  }

  return (
    <div className="twk-panel" role="dialog" aria-label={title}>
      <div className="twk-hd">
        <b>{title}</b>
        <button
          className="twk-x"
          aria-label="Close tweaks"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  )
}

export function TweakSection({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  )
}

function TweakRow({
  label,
  value,
  inline = false,
  children,
}: PropsWithChildren<{ label: string; value?: ReactNode; inline?: boolean }>) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  )
}

type TweakSliderProps = {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}

export function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange,
}: TweakSliderProps) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input
        type="range"
        className="twk-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </TweakRow>
  )
}

type TweakToggleProps = {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}

export function TweakToggle({ label, value, onChange }: TweakToggleProps) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl">
        <span>{label}</span>
      </div>
      <button
        type="button"
        className="twk-toggle"
        data-on={value ? '1' : '0'}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  )
}

type TweakRadioProps<V extends string> = {
  label: string
  value: V
  options: RadioOption<V>[]
  onChange: (v: V) => void
}

export function TweakRadio<V extends string>({
  label,
  value,
  options,
  onChange,
}: TweakRadioProps<V>) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const valueRef = useRef(value)
  valueRef.current = value
  const [dragging, setDragging] = useState(false)

  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const n = options.length

  const segAt = (clientX: number): V => {
    const el = trackRef.current
    if (!el) return options[0].value
    const r = el.getBoundingClientRect()
    const inner = r.width - 4
    const i = Math.floor(((clientX - r.left - 2) / inner) * n)
    return options[Math.max(0, Math.min(n - 1, i))].value
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true)
    const v0 = segAt(e.clientX)
    if (v0 !== valueRef.current) onChange(v0)
    const move = (ev: PointerEvent) => {
      const v = segAt(ev.clientX)
      if (v !== valueRef.current) onChange(v)
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <TweakRow label={label}>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={onPointerDown}
        className={dragging ? 'twk-seg dragging' : 'twk-seg'}
      >
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  )
}

type TweakButtonProps = {
  label: string
  onClick: () => void
}

export function TweakButton({ label, onClick }: TweakButtonProps) {
  return (
    <button type="button" className="twk-btn" onClick={onClick}>
      {label}
    </button>
  )
}
