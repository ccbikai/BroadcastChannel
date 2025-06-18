export default function createIntegration() {
  return {
    name: '@html-zone/edge-one',
    hooks: {
      'astro:config:done': ({ setAdapter }) => {
        setAdapter({
          name: '@html-zone/edge-one',
          serverEntrypoint: './adapters/edge-one/server.js',
          exports: ['onRequest'],
          supportedAstroFeatures: {
            serverOutput: 'stable',
          },
        })
      },
    },
  }
}
