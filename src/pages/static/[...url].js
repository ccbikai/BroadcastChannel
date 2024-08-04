const targetWhitelist = [
  't.me',
  'telegram.org',
  'telegram.me',
  'telegram.dog',
  'cdn-telegram.org',
]

export const prerender = false

export async function GET(Astro) {
  const { request, params, url } = Astro
  const target = new URL(params.url + url.search)
  if (!targetWhitelist.some(host => target.host.endsWith(host))) {
    return Astro.redirect(target.toString(), 302)
  }
  return fetch(target.toString(), request)
}
