import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify(),
    presetWebFonts({
      provider: "google",
      fonts: {
        // these will extend the default theme
        sans: "Roboto",
        mono: ["Fira Code", "Fira Mono:400,700"],
        // custom ones
        lobster: "Lobster",
        lato: [
          {
            name: "Lato",
            weights: ["400", "700"],
            italic: true,
          },
          {
            name: "sans-serif",
            provider: "none",
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
