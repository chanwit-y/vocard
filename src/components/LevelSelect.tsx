import { Logo } from './Hud'
import { MenuButton } from './Sidebar'
import type { Level, ThemeTokens } from '../types'

type LevelMeta = {
  level: Level
  title: string
  subtitle: string
  accent: string
  surface: string
  pattern: string
}

const LEVEL_META: LevelMeta[] = [
  {
    level: 'A1',
    title: 'Beginner',
    subtitle: 'First words & everyday basics',
    accent: '#FF6F4D',
    surface: 'linear-gradient(160deg, #FFD7B5 0%, #FFB088 100%)',
    pattern:
      'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
  },
  {
    level: 'A2',
    title: 'Elementary',
    subtitle: 'Familiar topics & simple chats',
    accent: '#E08A2B',
    surface: 'linear-gradient(160deg, #FFE9B5 0%, #FFC857 100%)',
    pattern:
      'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0 2px, transparent 2px 16px)',
  },
  {
    level: 'B1',
    title: 'Intermediate',
    subtitle: 'Plans, opinions & narratives',
    accent: '#3FA572',
    surface: 'linear-gradient(160deg, #C8F2D9 0%, #6FD49E 100%)',
    pattern:
      'linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
  },
  {
    level: 'B2',
    title: 'Upper-intermediate',
    subtitle: 'Abstract ideas & nuance',
    accent: '#2F8DBE',
    surface: 'linear-gradient(160deg, #BEE5F2 0%, #6BB7D8 100%)',
    pattern:
      'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
  },
  {
    level: 'C1',
    title: 'Advanced',
    subtitle: 'Complex texts & implicit meaning',
    accent: '#7B5BD0',
    surface: 'linear-gradient(160deg, #DCD0F7 0%, #A78BE3 100%)',
    pattern:
      'repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 18px)',
  },
  {
    level: 'C2',
    title: 'Proficient',
    subtitle: 'Mastery, idiom & precision',
    accent: '#C4477B',
    surface: 'linear-gradient(160deg, #F5C7DC 0%, #E08AB3 100%)',
    pattern:
      'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
  },
]

type LevelSelectProps = {
  theme: ThemeTokens
  available: Level[]
  countsByLevel: Record<Level, number>
  onSelect: (level: Level) => void
  onOpenMenu?: () => void
}

export function LevelSelect({
  theme,
  available,
  countsByLevel,
  onSelect,
  onOpenMenu,
}: LevelSelectProps) {
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
      }}
    >
      <header
        style={{
          padding:
            'max(20px, env(safe-area-inset-top)) 22px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onOpenMenu && <MenuButton theme={theme} onClick={onOpenMenu} />}
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
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Pick your level
          </div>
          <div
            style={{
              marginTop: 6,
              color: theme.sub,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Choose a CEFR category to start a flashcard round.
          </div>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 18px 24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridAutoRows: 'min-content',
          gap: 14,
          alignContent: 'start',
        }}
      >
        {LEVEL_META.map((meta) => {
          const isAvailable = available.includes(meta.level)
          const count = countsByLevel[meta.level] ?? 0
          return (
            <button
              key={meta.level}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(meta.level)}
              style={{
                appearance: 'none',
                border: 0,
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                padding: '18px 16px 16px',
                borderRadius: 22,
                background: isAvailable ? meta.surface : theme.chip,
                color: isAvailable ? '#1d130a' : theme.sub,
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                opacity: isAvailable ? 1 : 0.55,
                fontFamily: 'inherit',
                boxShadow: isAvailable
                  ? '0 18px 36px -18px rgba(20, 12, 4, 0.45), 0 2px 6px rgba(20, 12, 4, 0.08)'
                  : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minHeight: 132,
                transition:
                  'transform 200ms cubic-bezier(.4,.0,.2,1), box-shadow 200ms',
              }}
              onPointerDown={(e) => {
                if (!isAvailable) return
                e.currentTarget.style.transform = 'scale(0.97)'
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {isAvailable && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: meta.pattern,
                    backgroundSize: '18px 18px',
                    opacity: 0.7,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: '-0.02em',
                    color: isAvailable ? meta.accent : theme.sub,
                  }}
                >
                  {meta.level}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.6)',
                    color: '#3a2410',
                    padding: '4px 8px',
                    borderRadius: 99,
                  }}
                >
                  {isAvailable ? `${count} words` : 'Soon'}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {meta.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0.78,
                    marginTop: 3,
                    lineHeight: 1.35,
                  }}
                >
                  {meta.subtitle}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
