import { GET } from '../../src/pages/static/[...url]'

export const config = {
  runtime: 'edge',
}

export default function handler(request) {
  const requestUrl = new URL(request.url)
  const directUrl = requestUrl.searchParams.get('url')

  if (directUrl) {
    return GET({
      request,
      params: {
        url: directUrl,
      },
      url: {
        search: '',
      },
    })
  }

  const pathUrl = request.url?.split('/static/')?.[1]

  if (!pathUrl) {
    return new Response('Not Found', { status: 404 })
  }

  const target = new URL(pathUrl + requestUrl.search)
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
