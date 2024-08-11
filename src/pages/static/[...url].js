const targetWhitelist = [
  't.me',
  'telegram.org',
  'telegram.me',
  'telegram.dog',
  'cdn-telegram.org',
  'telesco.pe',
  'yandex.ru',
]

export const prerender = false

export async function GET({ request, params, url }) {
  try {
    const target = new URL(params.url + url.search)
    if (!targetWhitelist.some(domain => target.hostname.endsWith(domain))) {
      return Response.redirect(target.toString(), 302)
    }
    return fetch(target.toString(), request)
  }
  catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
