import type { Level, VocabEntry } from '../types'
import { LEVELS, LEVEL_LIST } from './deck'

export type CategoryKey =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'article'
  | 'number'
  | 'exclamation'
  | 'other'

export type CategoryMeta = {
  key: CategoryKey
  label: string
  short: string
  accent: string
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  noun: { key: 'noun', label: 'Nouns', short: 'n.', accent: '#3FA572' },
  verb: { key: 'verb', label: 'Verbs', short: 'v.', accent: '#FF6F4D' },
  adjective: { key: 'adjective', label: 'Adjectives', short: 'adj.', accent: '#7B5BD0' },
  adverb: { key: 'adverb', label: 'Adverbs', short: 'adv.', accent: '#2F8DBE' },
  pronoun: { key: 'pronoun', label: 'Pronouns', short: 'pron.', accent: '#C4477B' },
  preposition: { key: 'preposition', label: 'Prepositions', short: 'prep.', accent: '#D98324' },
  conjunction: { key: 'conjunction', label: 'Conjunctions', short: 'conj.', accent: '#5A8F4A' },
  determiner: { key: 'determiner', label: 'Determiners', short: 'det.', accent: '#A66A2C' },
  article: { key: 'article', label: 'Articles', short: 'art.', accent: '#B85C9E' },
  number: { key: 'number', label: 'Numbers', short: 'num.', accent: '#4A7AB8' },
  exclamation: { key: 'exclamation', label: 'Exclamations', short: 'excl.', accent: '#E0723A' },
  other: { key: 'other', label: 'Other', short: '—', accent: '#7A6B58' },
}

export const CATEGORY_ORDER: CategoryKey[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'determiner',
  'article',
  'number',
  'exclamation',
  'other',
]

const TOKEN_TO_CATEGORY: Array<[RegExp, CategoryKey]> = [
  [/\bauxiliary v\.?/i, 'verb'],
  [/\bmodal v\.?/i, 'verb'],
  [/\bv\b\.?/i, 'verb'],
  [/\bnoun\b/i, 'noun'],
  [/\bn\b\.?/i, 'noun'],
  [/\badjective\b/i, 'adjective'],
  [/\badj\b\.?/i, 'adjective'],
  [/\badverb\b/i, 'adverb'],
  [/\badv\b\.?/i, 'adverb'],
  [/\bpronoun\b/i, 'pronoun'],
  [/\bpron\b\.?/i, 'pronoun'],
  [/\bpreposition\b/i, 'preposition'],
  [/\bprep\b\.?/i, 'preposition'],
  [/\bconjunction\b/i, 'conjunction'],
  [/\bconj\b\.?/i, 'conjunction'],
  [/\bdeterminer\b/i, 'determiner'],
  [/\bdet\b\.?/i, 'determiner'],
  [/\barticle\b/i, 'article'],
  [/\bnumber\b/i, 'number'],
  [/\bnum\b\.?/i, 'number'],
  [/\bexclam(ation)?\b\.?/i, 'exclamation'],
  [/\binterj(ection)?\b\.?/i, 'exclamation'],
]

export function categoriesForPos(pos: string): CategoryKey[] {
  if (!pos) return ['other']
  const tokens = pos
    .split(/[,/]/)
    .map((t) => t.trim())
    .filter(Boolean)

  const found = new Set<CategoryKey>()
  for (const token of tokens) {
    for (const [re, key] of TOKEN_TO_CATEGORY) {
      if (re.test(token)) {
        found.add(key)
      }
    }
  }
  if (found.size === 0) found.add('other')
  return Array.from(found)
}

export type VocabRow = VocabEntry & { level: Level }

export type CategoryGroup = {
  key: CategoryKey
  meta: CategoryMeta
  count: number
  entries: VocabRow[]
}

export function buildCategoryGroups(filterLevel: Level | 'ALL' = 'ALL'): CategoryGroup[] {
  const buckets = new Map<CategoryKey, VocabRow[]>()
  for (const key of CATEGORY_ORDER) buckets.set(key, [])

  const levels = filterLevel === 'ALL' ? LEVEL_LIST : [filterLevel]
  for (const level of levels) {
    const entries = LEVELS[level] ?? []
    for (const entry of entries) {
      const cats = categoriesForPos(entry.pos)
      const row: VocabRow = { ...entry, level }
      for (const cat of cats) {
        buckets.get(cat)!.push(row)
      }
    }
  }

  for (const list of buckets.values()) {
    list.sort((a, b) => a.word.localeCompare(b.word, undefined, { sensitivity: 'base' }))
  }

  return CATEGORY_ORDER.map((key) => ({
    key,
    meta: CATEGORY_META[key],
    count: buckets.get(key)!.length,
    entries: buckets.get(key)!,
  })).filter((g) => g.count > 0)
}
