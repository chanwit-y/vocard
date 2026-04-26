import { useDeferredValue, useMemo, useState } from 'react'
import { Logo } from './Hud'
import { MenuButton } from './Sidebar'
import {
  buildCategoryGroups,
  type CategoryGroup,
  type CategoryKey,
  type VocabRow,
} from '../data/categories'
import { LEVEL_LIST } from '../data/deck'
import type { Level, ThemeTokens } from '../types'

type VocabularyPageProps = {
  theme: ThemeTokens
  dark: boolean
  onOpenMenu: () => void
}

type LevelFilter = Level | 'ALL'

const LEVEL_TINT: Record<Level, string> = {
  A1: '#FF6F4D',
  A2: '#E08A2B',
  B1: '#3FA572',
  B2: '#2F8DBE',
  C1: '#7B5BD0',
  C2: '#C4477B',
}

export function VocabularyPage({ theme, dark, onOpenMenu }: VocabularyPageProps) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('ALL')
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const groups = useMemo<CategoryGroup[]>(
    () => buildCategoryGroups(levelFilter),
    [levelFilter],
  )

  const filteredGroups = useMemo<CategoryGroup[]>(() => {
    const q = deferredQuery.trim().toLowerCase()
    let list = groups
    if (activeCategory !== 'ALL') {
      list = list.filter((g) => g.key === activeCategory)
    }
    if (!q) return list
    return list
      .map((g) => ({
        ...g,
        entries: g.entries.filter(
          (e) =>
            e.word.toLowerCase().includes(q) ||
            e.translation.toLowerCase().includes(q) ||
            e.pos.toLowerCase().includes(q),
        ),
      }))
      .map((g) => ({ ...g, count: g.entries.length }))
      .filter((g) => g.count > 0)
  }, [groups, activeCategory, deferredQuery])

  const totalWords = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.count, 0),
    [filteredGroups],
  )

  const levelOptions: LevelFilter[] = ['ALL', ...LEVEL_LIST]

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
          padding: 'max(20px, env(safe-area-inset-top)) 18px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MenuButton theme={theme} onClick={onOpenMenu} />
          <Logo color={theme.progressFill} />
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: '-0.02em',
            }}
          >
            Vocabulary
          </span>
        </div>

        <div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Browse by category
          </div>
          <div
            style={{
              marginTop: 4,
              color: theme.sub,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {totalWords} word{totalWords === 1 ? '' : 's'}
            {levelFilter !== 'ALL' ? ` in ${levelFilter}` : ' across all levels'}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 14,
              color: theme.sub,
              fontSize: 14,
              pointerEvents: 'none',
            }}
          >
            <SearchIcon color={theme.sub} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words or meanings…"
            aria-label="Search vocabulary"
            style={{
              width: '100%',
              border: 0,
              outline: 'none',
              padding: '12px 16px 12px 38px',
              borderRadius: 14,
              background: theme.chip,
              color: theme.text,
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
            }}
          />
        </div>

        <ChipScroller>
          {levelOptions.map((lvl) => {
            const active = levelFilter === lvl
            return (
              <Chip
                key={lvl}
                active={active}
                theme={theme}
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl === 'ALL' ? 'All levels' : lvl}
              </Chip>
            )
          })}
        </ChipScroller>

        <ChipScroller>
          <Chip
            active={activeCategory === 'ALL'}
            theme={theme}
            onClick={() => setActiveCategory('ALL')}
          >
            All
          </Chip>
          {groups.map((g) => (
            <Chip
              key={g.key}
              active={activeCategory === g.key}
              theme={theme}
              accent={g.meta.accent}
              onClick={() => setActiveCategory(g.key)}
            >
              {g.meta.label}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  opacity: 0.7,
                }}
              >
                {g.count}
              </span>
            </Chip>
          ))}
        </ChipScroller>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px 28px',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {filteredGroups.length === 0 ? (
          <EmptyState theme={theme} />
        ) : (
          filteredGroups.map((group) => (
            <CategorySection
              key={group.key}
              group={group}
              theme={theme}
              dark={dark}
              showLevelTag={levelFilter === 'ALL'}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ChipScroller({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        marginInline: -2,
        paddingInline: 2,
        scrollbarWidth: 'none',
      }}
    >
      {children}
    </div>
  )
}

type ChipProps = {
  active: boolean
  accent?: string
  theme: ThemeTokens
  onClick: () => void
  children: React.ReactNode
}

function Chip({ active, accent, theme, onClick, children }: ChipProps) {
  const activeBg = accent ?? theme.progressFill
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        appearance: 'none',
        border: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.03em',
        padding: '8px 14px',
        borderRadius: 999,
        background: active ? activeBg : theme.chip,
        color: active ? '#FFF7EE' : theme.text,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background 160ms, color 160ms',
      }}
    >
      {children}
    </button>
  )
}

type CategorySectionProps = {
  group: CategoryGroup
  theme: ThemeTokens
  dark: boolean
  showLevelTag: boolean
}

function CategorySection({
  group,
  theme,
  dark,
  showLevelTag,
}: CategorySectionProps) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          padding: '0 4px 8px',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: group.meta.accent,
            display: 'inline-block',
          }}
        />
        <h2
          style={{
            margin: 0,
            fontFamily: "'Fraunces', serif",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          {group.meta.label}
        </h2>
        <span
          style={{
            color: theme.sub,
            fontSize: 12,
            fontWeight: 700,
            marginLeft: 'auto',
          }}
        >
          {group.count}
        </span>
      </div>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {group.entries.map((entry) => (
          <WordRow
            key={`${entry.level}-${entry.word}`}
            entry={entry}
            theme={theme}
            dark={dark}
            showLevelTag={showLevelTag}
            accent={group.meta.accent}
          />
        ))}
      </ul>
    </section>
  )
}

type WordRowProps = {
  entry: VocabRow
  theme: ThemeTokens
  dark: boolean
  showLevelTag: boolean
  accent: string
}

function WordRow({ entry, theme, dark, showLevelTag, accent }: WordRowProps) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 14,
        background: dark
          ? 'rgba(255,241,224,0.05)'
          : 'rgba(255,255,255,0.65)',
        border: `1px solid ${theme.pillBorder}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '-0.01em',
            }}
          >
            {entry.word}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: accent,
              background: hexWithAlpha(accent, dark ? 0.2 : 0.14),
              padding: '2px 8px',
              borderRadius: 99,
            }}
          >
            {entry.pos}
          </span>
          {showLevelTag && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#FFF7EE',
                background: LEVEL_TINT[entry.level],
                padding: '2px 7px',
                borderRadius: 99,
              }}
            >
              {entry.level}
            </span>
          )}
        </div>
        <div
          style={{
            marginTop: 3,
            color: theme.sub,
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {entry.translation}
        </div>
      </div>
    </li>
  )
}

function EmptyState({ theme }: { theme: ThemeTokens }) {
  return (
    <div
      style={{
        marginTop: 40,
        textAlign: 'center',
        color: theme.sub,
        fontSize: 14,
        fontWeight: 600,
        padding: '24px',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
      No words match that search.
    </div>
  )
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.8" />
      <path
        d="m20 20-3.2-3.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#?([a-f\d]{6})$/i.exec(hex)
  if (!m) return hex
  const int = parseInt(m[1], 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
