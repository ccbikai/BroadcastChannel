import { GET } from '../../src/pages/static/[...url]'

export const config = {
  runtime: 'edge',
}

export default function handler(request) {
  const url = request.url?.split('/static/')?.[1]

  if (!url) {
    return new Response('Not Found', { status: 404 })
  }

  const target = new URL(url)
  target.searchParams.delete('path')

  return GET({
    request,
    params: {
      url: target.origin + target.pathname,
    },
    url: {
      search: target.search,
    },
  })
}
