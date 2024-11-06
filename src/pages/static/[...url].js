const targetWhitelist = [
  't.me',
  'telegram.org',
  'telegram.me',
  'telegram.dog',
  'cdn-telegram.org',
  'telesco.pe',
  'yandex.ru',
]

export async function GET({ request, params, url }) {
  try {
    const target = new URL(params.url + url.search)
    if (!targetWhitelist.some(domain => target.hostname.endsWith(domain))) {
      return Response.redirect(target.toString(), 302)
    }
    const response = await fetch(target.toString(), request)
    return new Response(response.body, response)
  }
  catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
