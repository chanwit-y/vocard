import type { DeckCard, Level, VocabEntry } from '../types'
import { LEVEL_ORDER } from '../types'
import dataJson from './data.json'

type RawDataset = {
  levels: Record<Level, VocabEntry[]>
}

const dataset = dataJson as RawDataset

export const LEVELS: Record<Level, VocabEntry[]> = dataset.levels

export const LEVEL_LIST: Level[] = LEVEL_ORDER.filter(
  (lvl) => Array.isArray(LEVELS[lvl]) && LEVELS[lvl].length > 0,
)

export function vocabFor(level: Level): VocabEntry[] {
  return LEVELS[level] ?? []
}

export function maxRoundFor(level: Level): number {
  return Math.min(50, vocabFor(level).length)
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildRound(
  level: Level,
  size: number,
  seed = Date.now(),
): DeckCard[] {
  const pool = vocabFor(level)
  if (pool.length === 0) return []
  const sample = shuffle(pool).slice(0, Math.max(1, Math.min(size, pool.length)))
  return sample.map((entry, i) => ({
    ...entry,
    id: `${entry.word}-${seed}-${i}`,
  }))
}
