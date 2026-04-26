import type { CardVariantTokens, ThemeMode, ThemeTokens, Variant } from './types'

export const THEMES: Record<ThemeMode, ThemeTokens> = {
  light: {
    bg: '#FFF7EE',
    bgGrad:
      'radial-gradient(120% 80% at 20% 0%, #FFE9D2 0%, #FFF7EE 55%, #FFEFE0 100%)',
    text: '#2A1F14',
    sub: '#7A6B58',
    chip: 'rgba(42,31,20,0.06)',
    chipText: '#2A1F14',
    pillBg: 'rgba(255,255,255,0.85)',
    pillBorder: 'rgba(42,31,20,0.08)',
    progressTrack: 'rgba(42,31,20,0.08)',
    progressFill: '#FF6F4D',
    redTint: 'rgba(255, 95, 95, 0.85)',
    greenTint: 'rgba(60, 200, 130, 0.85)',
    btnBg: '#2A1F14',
    btnText: '#FFF7EE',
  },
  dark: {
    bg: '#15110C',
    bgGrad:
      'radial-gradient(120% 80% at 20% 0%, #2B1F14 0%, #15110C 55%, #1A140E 100%)',
    text: '#FFF1E0',
    sub: '#A89682',
    chip: 'rgba(255,241,224,0.08)',
    chipText: '#FFF1E0',
    pillBg: 'rgba(255,241,224,0.06)',
    pillBorder: 'rgba(255,241,224,0.1)',
    progressTrack: 'rgba(255,241,224,0.1)',
    progressFill: '#FF8B6B',
    redTint: 'rgba(255, 95, 95, 0.85)',
    greenTint: 'rgba(60, 200, 130, 0.85)',
    btnBg: '#FFF1E0',
    btnText: '#15110C',
  },
}

export const CARD_VARIANTS: Record<Variant, CardVariantTokens> = {
  coral: {
    name: 'Coral',
    front: {
      bg: 'linear-gradient(160deg, #FF8A65 0%, #FF6F4D 60%, #F25C3A 100%)',
      text: '#FFF7EE',
      accent: '#FFE9D2',
      pattern:
        'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)',
      patternSize: '18px 18px',
    },
    back: {
      bg: 'linear-gradient(160deg, #FFE9D2 0%, #FFD7B5 100%)',
      text: '#2A1F14',
      accent: '#FF6F4D',
    },
  },
  mint: {
    name: 'Mint',
    front: {
      bg: 'linear-gradient(155deg, #B8F0D2 0%, #6FD49E 60%, #4CB87E 100%)',
      text: '#0F2C1E',
      accent: '#0F2C1E',
      pattern:
        'linear-gradient(rgba(15,44,30,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,44,30,0.06) 1px, transparent 1px)',
      patternSize: '24px 24px',
    },
    back: {
      bg: 'linear-gradient(155deg, #FFF7EE 0%, #FFEFE0 100%)',
      text: '#0F2C1E',
      accent: '#4CB87E',
    },
  },
  butter: {
    name: 'Butter',
    front: {
      bg: 'linear-gradient(150deg, #FFE08A 0%, #FFC857 55%, #FFAE2E 100%)',
      text: '#3A2410',
      accent: '#3A2410',
      pattern:
        'repeating-linear-gradient(45deg, rgba(58,36,16,0.05) 0 2px, transparent 2px 18px)',
      patternSize: 'auto',
    },
    back: {
      bg: 'linear-gradient(150deg, #FFF7EE 0%, #FFEAC4 100%)',
      text: '#3A2410',
      accent: '#FFAE2E',
    },
  },
}
