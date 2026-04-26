export type VocabEntry = {
  word: string
  pos: string
  translation: string
}

export type DeckCard = VocabEntry & { id: string }

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export const LEVEL_ORDER: readonly Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export type Variant = 'coral' | 'mint' | 'butter'

export type ThemeMode = 'light' | 'dark'

export type ThemeTokens = {
  bg: string
  bgGrad: string
  text: string
  sub: string
  chip: string
  chipText: string
  pillBg: string
  pillBorder: string
  progressTrack: string
  progressFill: string
  redTint: string
  greenTint: string
  btnBg: string
  btnText: string
}

export type CardFaceTokens = {
  bg: string
  text: string
  accent: string
  pattern?: string
  patternSize?: string
}

export type CardVariantTokens = {
  name: string
  front: CardFaceTokens & { pattern: string; patternSize: string }
  back: CardFaceTokens
}

export type Tweaks = {
  dark: boolean
  variant: Variant
  fontSize: number
  roundSize: number
}

export type View = 'flashcards' | 'vocabulary'
