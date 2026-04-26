declare module 'react-speech-kit' {
  export type SpeakArgs = {
    text: string
    voice?: SpeechSynthesisVoice | null
    rate?: number
    pitch?: number
    volume?: number
  }

  export type UseSpeechSynthesisOptions = {
    onEnd?: () => void
  }

  export type UseSpeechSynthesisReturn = {
    supported: boolean
    speak: (args?: SpeakArgs) => void
    speaking: boolean
    cancel: () => void
    voices: SpeechSynthesisVoice[]
  }

  export function useSpeechSynthesis(
    options?: UseSpeechSynthesisOptions,
  ): UseSpeechSynthesisReturn

  export type UseSpeechRecognitionOptions = {
    onResult?: (result: string) => void
    onEnd?: () => void
    onError?: (event: unknown) => void
  }

  export type ListenArgs = {
    lang?: string
    interimResults?: boolean
  }

  export type UseSpeechRecognitionReturn = {
    supported: boolean
    listen: (args?: ListenArgs) => void
    listening: boolean
    stop: () => void
  }

  export function useSpeechRecognition(
    options?: UseSpeechRecognitionOptions,
  ): UseSpeechRecognitionReturn
}
