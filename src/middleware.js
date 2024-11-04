export async function onRequest(context, next) {
  context.locals.SITE_URL = `${import.meta.env.SITE ?? ''}${import.meta.env.BASE_URL}`

  const response = await next()

  if (!response.bodyUsed) {
    response.headers.set('Speculation-Rules', '"/rules/prefetch.json"')
  }
  return response
};
