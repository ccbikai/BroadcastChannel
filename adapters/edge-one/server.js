import { App } from 'astro/app'

export function createExports(manifest) {
  const app = new App(manifest)

  const onRequest = ({ request, params, env }) => {
    return app.render(request, {
      locals: {
        params,
        env,
      },
    })
  }

  return { onRequest }
}
