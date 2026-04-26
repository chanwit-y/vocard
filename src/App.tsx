import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CompleteScreen } from './components/CompleteScreen'
import { Flashcard, type SwipeDir } from './components/Flashcard'
import { Logo, Pill } from './components/Hud'
import { LevelSelect } from './components/LevelSelect'
import { MenuButton, Sidebar } from './components/Sidebar'
import { VocabularyPage } from './components/VocabularyPage'
import { WordCountModal } from './components/WordCountModal'
import {
  TweakButton,
  TweakRadio,
  TweakSection,
  TweakSlider,
  TweakToggle,
  TweaksPanel,
} from './components/TweaksPanel'
import { buildRound, LEVEL_LIST, LEVELS, maxRoundFor } from './data/deck'
import { useTweaks } from './hooks/useTweaks'
import { CARD_VARIANTS, THEMES } from './themes'
import type { DeckCard, Level, Tweaks, Variant, View } from './types'
import { PWABadge } from './PWABadge'

const TWEAK_DEFAULTS: Tweaks = {
  dark: false,
  variant: 'coral',
  fontSize: 16,
  roundSize: 20,
}

const VARIANT_OPTIONS: { label: string; value: Variant }[] = (
  Object.keys(CARD_VARIANTS) as Variant[]
).map((v) => ({ label: CARD_VARIANTS[v].name, value: v }))

const SESSION_KEY = 'vocard:session:v1'

type Session = { level: Level; roundSize: number } | null

function readSession(): Session {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.level ||
      !LEVEL_LIST.includes(parsed.level)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeSession(session: Session) {
  if (typeof window === 'undefined') return
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      window.localStorage.removeItem(SESSION_KEY)
    }
  } catch {
    // ignore
  }
}

export default function App() {
  const [t, setTweak] = useTweaks<Tweaks>(TWEAK_DEFAULTS)
  const theme = THEMES[t.dark ? 'dark' : 'light']

  const [session, setSession] = useState<Session>(() => readSession())
  const [pendingLevel, setPendingLevel] = useState<Level | null>(null)
  const [view, setView] = useState<View>('flashcards')
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const handleSelectView = useCallback((next: View) => setView(next), [])

  useEffect(() => {
    writeSession(session)
  }, [session])

  const roundSeedRef = useRef(Date.now())
  const initialDeck = useMemo<DeckCard[]>(() => {
    if (!session) return []
    return buildRound(session.level, session.roundSize, roundSeedRef.current)
  }, [session])

  const [queue, setQueue] = useState<DeckCard[]>(initialDeck)
  const [knownCount, setKnownCount] = useState(0)
  const [reviewedCards, setReviewedCards] = useState<DeckCard[]>([])
  const [pulse, setPulse] = useState<'known' | 'review' | null>(null)

  useEffect(() => {
    setQueue(initialDeck)
    setKnownCount(0)
    setReviewedCards([])
  }, [initialDeck])

  useEffect(() => {
    // Set color and image separately (not the `background` shorthand) so
    // we never accidentally clear the solid backgroundColor. iOS PWA
    // standalone mode paints the home-indicator strip from the body's
    // background-color, so it must always be a solid theme color.
    document.documentElement.style.backgroundColor = theme.bg
    document.documentElement.style.backgroundImage = theme.bgGrad
    document.body.style.backgroundColor = theme.bg
    const metas = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    metas.forEach((meta) => {
      meta.content = theme.bg
    })
  }, [theme.bg, theme.bgGrad])

  const totalWords = queue.length + knownCount + reviewedCards.length
  const progress = totalWords === 0 ? 0 : knownCount / totalWords

  const handleSwipe = useCallback((dir: SwipeDir) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev
      const [current, ...rest] = prev
      if (dir === 'right') {
        setKnownCount((k) => k + 1)
        setPulse('known')
      } else {
        setReviewedCards((r) => [...r, current])
        setPulse('review')
      }
      return rest
    })
    window.setTimeout(() => setPulse(null), 300)
  }, [])

  const handleRestart = useCallback(() => {
    if (!session) return
    roundSeedRef.current = Date.now()
    const fresh = buildRound(session.level, session.roundSize, roundSeedRef.current)
    setQueue(fresh)
    setKnownCount(0)
    setReviewedCards([])
  }, [session])

  const handlePracticeReview = useCallback(() => {
    setReviewedCards((prev) => {
      if (prev.length === 0) return prev
      setQueue(prev)
      setKnownCount(0)
      return []
    })
  }, [])

  const handleBackToLevels = useCallback(() => {
    setSession(null)
    setQueue([])
    setKnownCount(0)
    setReviewedCards([])
  }, [])

  const handlePickLevel = useCallback((level: Level) => {
    setPendingLevel(level)
  }, [])

  const handleConfirmCount = useCallback(
    (count: number) => {
      if (!pendingLevel) return
      const safe = Math.max(1, Math.min(count, maxRoundFor(pendingLevel)))
      setTweak('roundSize', safe)
      roundSeedRef.current = Date.now()
      setSession({ level: pendingLevel, roundSize: safe })
      setPendingLevel(null)
    },
    [pendingLevel, setTweak],
  )

  const countsByLevel = useMemo(() => {
    const out = {} as Record<Level, number>
    for (const lvl of LEVEL_LIST) out[lvl] = LEVELS[lvl].length
    return out
  }, [])

  const sidebar = (
    <Sidebar
      open={menuOpen}
      onClose={closeMenu}
      current={view}
      theme={theme}
      dark={t.dark}
      onSelect={handleSelectView}
    />
  )

  if (view === 'vocabulary') {
    return (
      <>
        <VocabularyPage theme={theme} dark={t.dark} onOpenMenu={openMenu} />
        {sidebar}
        <PWABadge />
      </>
    )
  }

  if (!session) {
    return (
      <>
        <LevelSelect
          theme={theme}
          available={LEVEL_LIST}
          countsByLevel={countsByLevel}
          onSelect={handlePickLevel}
          onOpenMenu={openMenu}
        />
        {pendingLevel && (
          <WordCountModal
            level={pendingLevel}
            theme={theme}
            poolSize={LEVELS[pendingLevel]?.length ?? 0}
            initialValue={Math.min(t.roundSize, maxRoundFor(pendingLevel))}
            maxValue={maxRoundFor(pendingLevel)}
            onCancel={() => setPendingLevel(null)}
            onConfirm={handleConfirmCount}
          />
        )}
        {sidebar}
        <PWABadge />
      </>
    )
  }

  const isComplete = queue.length === 0
  const visibleCards = queue.slice(0, 3)
  const maxRoundSize = maxRoundFor(session.level)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.bgGrad,
        color: theme.text,
        fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background 400ms',
      }}
    >
      <header
        style={{
          padding: '20px 22px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          paddingTop: 'max(20px, env(safe-area-inset-top))',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MenuButton theme={theme} onClick={openMenu} />
            <Logo color={theme.progressFill} />
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: '-0.02em',
              }}
            >
              Vocard
            </span>
            <button
              type="button"
              onClick={handleBackToLevels}
              aria-label="Change level"
              style={{
                appearance: 'none',
                border: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.sub,
                padding: '4px 10px',
                borderRadius: 99,
                background: theme.chip,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{session.level}</span>
              <span style={{ opacity: 0.55, fontSize: 10 }}>▾</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Pill
              theme={theme}
              icon="✓"
              value={knownCount}
              label="known"
              pulse={pulse === 'known'}
              accent="#1F8A4F"
            />
            <Pill
              theme={theme}
              icon="↻"
              value={reviewedCards.length}
              label="review"
              pulse={pulse === 'review'}
              accent="#C4302B"
            />
          </div>
        </div>

        <div
          style={{
            height: 6,
            borderRadius: 99,
            background: theme.progressTrack,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: theme.progressFill,
              borderRadius: 99,
              transition: 'width 360ms cubic-bezier(.4,.0,.2,1)',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 12,
            color: theme.sub,
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 600,
            letterSpacing: '0.02em',
            marginTop: -8,
          }}
        >
          <span>
            {knownCount} of {totalWords} mastered
          </span>
          <span>{queue.length} left in queue</span>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          position: 'relative',
          padding: '8px 24px 16px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 380,
            aspectRatio: '3 / 4.2',
            alignSelf: 'center',
          }}
        >
          {isComplete ? (
            <CompleteScreen
              known={knownCount}
              reviewed={reviewedCards.length}
              theme={theme}
              onRestart={handleRestart}
              onPracticeReview={
                reviewedCards.length > 0 ? handlePracticeReview : undefined
              }
              onChangeLevel={handleBackToLevels}
            />
          ) : (
            visibleCards.map((card, i) => (
              <Flashcard
                key={card.id}
                card={card}
                variant={t.variant}
                theme={theme}
                fontSize={t.fontSize}
                onSwipe={handleSwipe}
                isTop={i === 0}
                stackIndex={i}
              />
            ))
          )}
        </div>
      </main>

      <TweaksPanel title="Tweaks" dark={t.dark}>
        <TweakSection label="Theme" />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />

        <TweakSection label="Card style" />
        <TweakRadio<Variant>
          label="Variant"
          value={t.variant}
          options={VARIANT_OPTIONS}
          onChange={(v) => setTweak('variant', v)}
        />

        <TweakSection label="Typography" />
        <TweakSlider
          label="Font size"
          value={t.fontSize}
          min={13}
          max={22}
          step={1}
          unit="px"
          onChange={(v) => setTweak('fontSize', v)}
        />

        <TweakSection label="Deck" />
        <TweakSlider
          label="Round size"
          value={Math.min(session.roundSize, maxRoundSize)}
          min={1}
          max={maxRoundSize}
          step={1}
          unit=" words"
          onChange={(v) => {
            setTweak('roundSize', v)
            setSession({ level: session.level, roundSize: v })
          }}
        />
        <TweakButton label="Restart deck" onClick={handleRestart} />
        <TweakButton label="Change level" onClick={handleBackToLevels} />
      </TweaksPanel>

      {sidebar}
      <PWABadge />
    </div>
  )
}
