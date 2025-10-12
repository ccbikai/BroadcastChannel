const UNDEFINED_STRING = 'undefined'

function normalizeBaseUrl(base = '/') {
  if (typeof base !== 'string' || base.length === 0) {
    return '/'
  }

  const isAbsoluteUrl = /^(?:[a-zA-Z][\w+.-]*:|\/\/)/u.test(base)

  if (isAbsoluteUrl) {
    return base.endsWith('/') ? base : `${base}/`
  }

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

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "media-src 'self' https:",
    "frame-src 'self' https: https://www.youtube-nocookie.com https://www.youtube.com https://open.spotify.com https://embed.music.apple.com https://w.soundcloud.com https://bandcamp.com",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ]

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  return response
}
