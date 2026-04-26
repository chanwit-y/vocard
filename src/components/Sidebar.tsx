import { useEffect } from 'react'
import type { ThemeTokens, View } from '../types'

type SidebarItem = {
  view: View
  label: string
  description: string
  icon: 'cards' | 'list'
}

const ITEMS: SidebarItem[] = [
  {
    view: 'flashcards',
    label: 'Flashcards',
    description: 'Practice with swipeable cards',
    icon: 'cards',
  },
  {
    view: 'vocabulary',
    label: 'Vocabulary',
    description: 'Browse all words by category',
    icon: 'list',
  },
]

type SidebarProps = {
  open: boolean
  onClose: () => void
  current: View
  theme: ThemeTokens
  dark: boolean
  onSelect: (view: View) => void
}

export function Sidebar({
  open,
  onClose,
  current,
  theme,
  dark,
  onSelect,
}: SidebarProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(20, 12, 4, 0.45)',
          opacity: open ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />
      <aside
        role="dialog"
        aria-label="Navigation"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 'min(86vw, 320px)',
          background: dark
            ? 'linear-gradient(180deg, #1F1810 0%, #15110C 100%)'
            : 'linear-gradient(180deg, #FFF7EE 0%, #FFEFE0 100%)',
          color: theme.text,
          boxShadow: open ? '24px 0 60px -20px rgba(20,12,4,0.55)' : 'none',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 260ms cubic-bezier(.4,.0,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'max(20px, env(safe-area-inset-top))',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            padding: '6px 18px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Menu
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              appearance: 'none',
              border: 0,
              background: theme.chip,
              color: theme.text,
              width: 36,
              height: 36,
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '0 14px',
          }}
        >
          {ITEMS.map((item) => {
            const active = item.view === current
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => {
                  onSelect(item.view)
                  onClose()
                }}
                style={{
                  appearance: 'none',
                  textAlign: 'left',
                  border: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 14px',
                  borderRadius: 16,
                  background: active
                    ? dark
                      ? 'rgba(255, 143, 107, 0.16)'
                      : 'rgba(255, 111, 77, 0.14)'
                    : 'transparent',
                  color: theme.text,
                  transition: 'background 160ms',
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: active
                      ? theme.progressFill
                      : theme.chip,
                    color: active ? '#FFF7EE' : theme.text,
                    flexShrink: 0,
                  }}
                >
                  {item.icon === 'cards' ? <CardsIcon /> : <ListIcon />}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: theme.sub,
                    }}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div
          style={{
            padding: '12px 22px 4px',
            color: theme.sub,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Vocard
        </div>
      </aside>
    </div>
  )
}

type MenuButtonProps = {
  theme: ThemeTokens
  onClick: () => void
}

export function MenuButton({ theme, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      style={{
        appearance: 'none',
        border: 0,
        cursor: 'pointer',
        background: theme.chip,
        color: theme.text,
        width: 38,
        height: 38,
        borderRadius: 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

function CardsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="6"
        width="13"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.55"
      />
      <rect
        x="7"
        y="3"
        width="13"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 6.5h3M5 12h3M5 17.5h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M11 6.5h8M11 12h8M11 17.5h8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
