// PostCSS config for Vite
// - autoprefixer: ベンダープレフィックス付与
// - postcss-preset-env: 近代CSSを段階的に利用（ネスティング等）
import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': true,
      },
    }),
    autoprefixer(),
  ],
}
