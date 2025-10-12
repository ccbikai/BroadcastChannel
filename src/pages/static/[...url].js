const baseTargetWhitelist = [
  't.me',
  'telegram.org',
  'telegram.me',
  'telegram.dog',
  'cdn-telegram.org',
  'telesco.pe',
  'yandex.ru',
]

const additionalHosts = (import.meta.env?.STATIC_PROXY_HOSTS ?? '')
  .split(',')
  .map(host => host.trim())
  .filter(Boolean)

const targetWhitelist = [...baseTargetWhitelist, ...additionalHosts]

function isHostAllowed(hostname) {
  if (!hostname) {
    return false
  }

  return targetWhitelist.some((domain) => {
    if (domain === '*') {
      return true
    }

    if (hostname === domain) {
      return true
    }

    return hostname.endsWith(`.${domain}`)
  })
}

const disallowedHeaders = ['host', 'cookie', 'origin', 'referer']

export async function GET({ request, params, url }) {
  try {
    const requestUrl = new URL(request.url)
    const paramUrl = requestUrl.searchParams.get('url')

    let targetUrl = paramUrl
    if (!targetUrl) {
      const base = Array.isArray(params?.url) ? params.url.join('/') : params?.url
      if (!base) {
        return new Response('Missing url', { status: 400 })
      }
      targetUrl = `${base}${url?.search ?? ''}`
    }

    const target = new URL(targetUrl)

    if (!isHostAllowed(target.hostname)) {
      return Response.redirect(target.toString(), 302)
    }

    const headers = new Headers(request.headers)
    disallowedHeaders.forEach((header) => {
      headers.delete(header)
    })

    const upstreamRequest = new Request(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    const response = await fetch(upstreamRequest)
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('access-control-allow-origin', '*')
    if (!responseHeaders.has('accept-ranges')) {
      responseHeaders.set('accept-ranges', 'bytes')
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  }
  catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
