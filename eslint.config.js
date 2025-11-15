import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  astro: true,
  rules: {
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  },
})
