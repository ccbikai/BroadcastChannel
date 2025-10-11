const UNDEFINED_STRING = 'undefined'

function normalizeBaseUrl(base = '/') {
  if (!base.startsWith('/')) {
    base = `/${base}`
  }

  if (!base.endsWith('/')) {
    base = `${base}/`
  }

  return base
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`
}

export async function onRequest(context, next) {
  const requestUrl = new URL(context.request.url)

  const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL ?? '/')
  const siteOverride = import.meta.env.SITE && import.meta.env.SITE !== UNDEFINED_STRING
    ? ensureTrailingSlash(import.meta.env.SITE)
    : `${requestUrl.origin}/`

  const siteUrl = new URL(baseUrl.slice(1), siteOverride).toString()
  const siteUrlObject = new URL(siteUrl)

  context.locals.BASE_URL = baseUrl
  context.locals.SITE_URL = siteUrlObject.toString()
  context.locals.SITE_ORIGIN = siteUrlObject.origin
  context.locals.RSS_URL = new URL('rss.xml', siteUrlObject).toString()

  const response = await next()

  if (!response.bodyUsed) {
    const contentType = response.headers.get('Content-Type') ?? ''

    if (contentType.startsWith('text/html')) {
      const speculationPath = new URL('rules/prefetch.json', siteUrlObject).pathname
      response.headers.set('Speculation-Rules', JSON.stringify({
        prefetch: [
          {
            source: 'list',
            urls: [speculationPath],
          },
        ],
      }))
    }

    if (!response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60')
    }
  }

  return response
}
