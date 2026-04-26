import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useSpeechSynthesis } from 'react-speech-kit'
import { CARD_VARIANTS } from '../themes'
import type { CardFaceTokens, DeckCard, ThemeTokens, Variant } from '../types'

const SWIPE_THRESHOLD = 110

export type SwipeDir = 'left' | 'right'

type FlashcardProps = {
  card: DeckCard
  variant: Variant
  theme: ThemeTokens
  fontSize: number
  onSwipe: (dir: SwipeDir) => void
  isTop: boolean
  stackIndex: number
}

export function Flashcard({
  card,
  variant,
  theme,
  fontSize,
  onSwipe,
  isTop,
  stackIndex,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [exiting, setExiting] = useState<SwipeDir | null>(null)
  const lastTap = useRef(0)
  const startPos = useRef({ x: 0, y: 0 })

  const { supported, speak, speaking, cancel, voices } = useSpeechSynthesis()

  const englishVoice = useMemo(() => {
    if (!voices || voices.length === 0) return null
    return (
      voices.find((v) => v.lang === 'en-US' && /female|samantha|google us english/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang?.startsWith('en')) ||
      null
    )
  }, [voices])

  const handleSpeak = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!supported) return
    if (speaking) {
      cancel()
      return
    }
    speak({ text: card.word, voice: englishVoice, rate: 0.95 })
  }

  const stopPointer = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    setFlipped(false)
    setDrag({ x: 0, y: 0 })
    setExiting(null)
    if (speaking) cancel()
  }, [card.id])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isTop || exiting) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startPos.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDrag({
      x: e.clientX - startPos.current.x,
      y: (e.clientY - startPos.current.y) * 0.4,
    })
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    const dist = Math.hypot(dx, dy)

    if (dist < 8) {
      const now = Date.now()
      if (now - lastTap.current < 320) {
        setFlipped((f) => !f)
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
      setDrag({ x: 0, y: 0 })
      return
    }

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const dir: SwipeDir = dx > 0 ? 'right' : 'left'
      setExiting(dir)
      window.setTimeout(() => onSwipe(dir), 280)
    } else {
      setDrag({ x: 0, y: 0 })
    }
  }

  let transform: string
  let transition: string
  if (exiting) {
    const dir = exiting === 'right' ? 1 : -1
    transform = `translate(${dir * 700}px, ${drag.y + 80}px) rotate(${dir * 28}deg)`
    transition = 'transform 280ms cubic-bezier(.4,.0,.2,1), opacity 280ms'
  } else if (dragging) {
    transform = `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.06}deg)`
    transition = 'none'
  } else {
    const offset = stackIndex * 8
    const scale = 1 - stackIndex * 0.04
    transform = `translate(0, ${offset}px) scale(${scale})`
    transition = 'transform 320ms cubic-bezier(.4,.0,.2,1)'
  }

  const tintOpacity = Math.min(Math.abs(drag.x) / SWIPE_THRESHOLD, 1) * 0.55
  const tintColor = drag.x > 0 ? theme.greenTint : theme.redTint
  const v = CARD_VARIANTS[variant]

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    transform,
    transition,
    opacity: exiting ? 0.4 : 1,
    touchAction: 'none',
    cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
    zIndex: 100 - stackIndex,
    pointerEvents: isTop ? 'auto' : 'none',
    perspective: '1400px',
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={wrapperStyle}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 600ms cubic-bezier(.4,.0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <CardFace
          face={v.front}
          isBack={false}
          card={card}
          fontSize={fontSize}
          tintOpacity={isTop && !flipped ? tintOpacity : 0}
          tintColor={tintColor}
          dragX={drag.x}
          isTop={isTop}
          onSpeak={handleSpeak}
          onSpeakerPointerDown={stopPointer}
          speaking={speaking}
          speechSupported={supported}
        />
        <CardFace
          face={v.back}
          isBack
          card={card}
          fontSize={fontSize}
          tintOpacity={isTop && flipped ? tintOpacity : 0}
          tintColor={tintColor}
          dragX={drag.x}
          isTop={isTop}
          onSpeak={handleSpeak}
          onSpeakerPointerDown={stopPointer}
          speaking={speaking}
          speechSupported={supported}
        />
      </div>
    </div>
  )
}

type CardFaceProps = {
  face: CardFaceTokens
  isBack: boolean
  card: DeckCard
  fontSize: number
  tintOpacity: number
  tintColor: string
  dragX: number
  isTop: boolean
  onSpeak: (e: ReactMouseEvent<HTMLButtonElement>) => void
  onSpeakerPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void
  speaking: boolean
  speechSupported: boolean
}

function CardFace({
  face,
  isBack,
  card,
  fontSize,
  tintOpacity,
  tintColor,
  dragX,
  isTop,
  onSpeak,
  onSpeakerPointerDown,
  speaking,
  speechSupported,
}: CardFaceProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: isBack ? 'rotateY(180deg)' : 'none',
        borderRadius: 28,
        overflow: 'hidden',
        background: face.bg,
        color: face.text,
        boxShadow:
          '0 24px 60px -20px rgba(20, 12, 4, 0.35), 0 4px 12px rgba(20, 12, 4, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: 28,
      }}
    >
      {!isBack && face.pattern && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: face.pattern,
            backgroundSize: face.patternSize,
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: face.accent,
          opacity: 0.85,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ opacity: 0.8 }}>{isBack ? 'Meaning' : 'Word'}</span>
        {speechSupported && (
          <button
            type="button"
            onClick={onSpeak}
            onPointerDown={onSpeakerPointerDown}
            disabled={!isTop}
            aria-label={speaking ? 'Stop pronunciation' : `Pronounce ${card.word}`}
            title={speaking ? 'Stop' : `Pronounce "${card.word}"`}
            style={{
              appearance: 'none',
              border: `1.5px solid ${face.accent}`,
              background: speaking
                ? face.accent
                : 'rgba(255,255,255,0.18)',
              color: speaking ? face.bg : face.accent,
              width: 34,
              height: 34,
              borderRadius: 99,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isTop ? 'pointer' : 'default',
              padding: 0,
              boxShadow: speaking
                ? '0 0 0 6px rgba(255,255,255,0.18)'
                : 'none',
              transition: 'background 180ms ease, box-shadow 220ms ease, transform 160ms ease',
              transform: speaking ? 'scale(1.06)' : 'scale(1)',
              opacity: isTop ? 1 : 0.55,
            }}
          >
            <SpeakerIcon active={speaking} />
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isBack ? 'flex-start' : 'center',
          textAlign: isBack ? 'left' : 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {!isBack ? (
          <>
            <div
              style={{
                fontFamily:
                  "'Fraunces', 'Nunito', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: fontSize * 2.6,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: face.text,
                wordBreak: 'break-word',
              }}
            >
              {card.word}
            </div>
            {card.pos && (
              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: face.accent,
                  opacity: 0.85,
                }}
              >
                {card.pos}
              </div>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily:
                  "'Fraunces', 'Nunito', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: fontSize * 1.4,
                lineHeight: 1.05,
                marginBottom: 8,
                color: face.accent,
              }}
            >
              {card.word}
            </div>
            {card.pos && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: face.text,
                  opacity: 0.55,
                  marginBottom: 14,
                }}
              >
                {card.pos}
              </div>
            )}
            <div
              style={{
                fontSize: fontSize * 1.35,
                lineHeight: 1.4,
                fontWeight: 600,
                fontFamily:
                  "'Noto Sans Thai', 'Nunito', system-ui, sans-serif",
              }}
            >
              {card.translation}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          fontSize: 11,
          opacity: 0.55,
          fontWeight: 600,
          letterSpacing: '0.05em',
          position: 'relative',
          zIndex: 1,
          color: face.accent,
        }}
      >
        {isBack
          ? 'Double-tap to flip back'
          : 'Double-tap to reveal · swipe to answer'}
      </div>

      {isTop && !isBack && Math.abs(dragX) > 30 && (
        <div
          style={{
            position: 'absolute',
            top: 36,
            ...(dragX > 0 ? { left: 32 } : { right: 32 }),
            transform: `rotate(${dragX > 0 ? -14 : 14}deg)`,
            border: `4px solid ${dragX > 0 ? '#1F8A4F' : '#C4302B'}`,
            color: dragX > 0 ? '#1F8A4F' : '#C4302B',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '0.08em',
            background: 'rgba(255,255,255,0.55)',
            opacity: Math.min(Math.abs(dragX) / 80, 1),
            zIndex: 2,
          }}
        >
          {dragX > 0 ? 'I KNOW' : 'REVIEW'}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: tintColor,
          opacity: tintOpacity,
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
      {active ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <path d="M15.5 9.5a4 4 0 0 1 0 5" />
      )}
    </svg>
  )
}
