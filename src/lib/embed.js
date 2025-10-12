const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:'])

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;')
}

function tryParseUrl(url) {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return null
  }

  try {
    const parsed = new URL(url.trim())

    if (!SUPPORTED_PROTOCOLS.has(parsed.protocol)) {
      return null
    }

    return parsed
  }
  catch {
    return null
  }
}

function createEmbedMarkup({ provider, iframe, aspectRatio, fallbackHref, fallbackLabel }) {
  const wrapperStyles = []

  if (aspectRatio) {
    wrapperStyles.push(`aspect-ratio: ${aspectRatio}`)
  }

  const styleAttribute = wrapperStyles.length > 0 ? ` style="${wrapperStyles.join('; ')}"` : ''
  const fallback = fallbackHref
    ? `<p class="embed__fallback"><a href="${escapeHtml(fallbackHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(fallbackLabel || fallbackHref)}</a></p>`
    : ''

  return `
    <div class="embed embed--${provider}">
      <div class="embed__inner"${styleAttribute}>
        ${iframe}
      </div>
      ${fallback}
    </div>
  `.trim()
}

function buildYouTubeEmbed(url, { title, description }) {
  const youTubeHosts = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtu.be',
  ])

  if (!youTubeHosts.has(url.hostname)) {
    return null
  }

  const params = new URLSearchParams(url.search)
  let videoId = ''
  let embedPath = ''

  if (url.hostname === 'youtu.be') {
    videoId = url.pathname.replace(/^\//u, '').split('/')[0]
  }
  else if (url.pathname.startsWith('/watch')) {
    videoId = params.get('v') ?? ''
  }
  else if (url.pathname.startsWith('/shorts/')) {
    videoId = url.pathname.split('/')[2] ?? ''
  }
  else if (url.pathname.startsWith('/live/')) {
    videoId = url.pathname.split('/')[2] ?? ''
  }
  else if (url.pathname.startsWith('/embed/')) {
    videoId = url.pathname.split('/')[2] ?? ''
  }
  else if (/^\/playlist/u.test(url.pathname)) {
    const listId = params.get('list')
    if (listId) {
      embedPath = `videoseries?${new URLSearchParams({ list: listId }).toString()}`
    }
  }

  if (!embedPath) {
    const listParam = params.get('list')
    embedPath = videoId ? `${videoId}${listParam ? `?list=${encodeURIComponent(listParam)}` : ''}` : ''
  }

  if (!embedPath) {
    return null
  }

  const embedUrl = `https://www.youtube.com/embed/${embedPath}`
  const iframe = `
    <iframe
      src="${embedUrl}"
      title="${escapeHtml(title || description || 'YouTube video player')}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      height="315"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  `.trim()

  return createEmbedMarkup({
    provider: 'youtube',
    iframe,
    aspectRatio: '16 / 9',
    fallbackHref: url.toString(),
    fallbackLabel: title,
  })
}

function buildBandcampEmbed(url, { title }) {
  if (!/bandcamp\.com$/u.test(url.hostname) && !/\.bandcamp\.com$/u.test(url.hostname)) {
    return null
  }

  const embedUrl = new URL('https://bandcamp.com/EmbeddedPlayer/')
  embedUrl.searchParams.set('url', url.toString())
  embedUrl.searchParams.set('size', 'large')
  embedUrl.searchParams.set('bgcol', '111111')
  embedUrl.searchParams.set('linkcol', '0d99ff')
  embedUrl.searchParams.set('transparent', 'true')

  const iframe = `
    <iframe
      src="${embedUrl.toString()}"
      title="${escapeHtml(title || 'Bandcamp player')}"
      loading="lazy"
      allow="clipboard-write; encrypted-media"
      height="470"
    ></iframe>
  `.trim()

  return createEmbedMarkup({
    provider: 'bandcamp',
    iframe,
    fallbackHref: url.toString(),
    fallbackLabel: title,
  })
}

function buildSoundCloudEmbed(url, { title }) {
  const hostname = url.hostname.toLowerCase()

  if (!hostname.endsWith('soundcloud.com') && hostname !== 'on.soundcloud.com') {
    return null
  }

  const embedUrl = new URL('https://w.soundcloud.com/player/')
  embedUrl.searchParams.set('url', url.toString())
  embedUrl.searchParams.set('color', '#ff5500')
  embedUrl.searchParams.set('auto_play', 'false')
  embedUrl.searchParams.set('hide_related', 'false')
  embedUrl.searchParams.set('show_comments', 'true')
  embedUrl.searchParams.set('show_user', 'true')
  embedUrl.searchParams.set('show_reposts', 'false')
  embedUrl.searchParams.set('visual', 'true')

  const iframe = `
    <iframe
      src="${embedUrl.toString()}"
      title="${escapeHtml(title || 'SoundCloud player')}"
      loading="lazy"
      allow="autoplay"
      height="450"
    ></iframe>
  `.trim()

  return createEmbedMarkup({
    provider: 'soundcloud',
    iframe,
    fallbackHref: url.toString(),
    fallbackLabel: title,
  })
}

function buildAppleMusicEmbed(url, { title }) {
  const hostname = url.hostname.toLowerCase()
  if (!hostname.endsWith('music.apple.com') && hostname !== 'itunes.apple.com') {
    return null
  }

  const embedUrl = new URL(url.toString())
  embedUrl.hostname = 'embed.music.apple.com'

  const iframe = `
    <iframe
      src="${embedUrl.toString()}"
      title="${escapeHtml(title || 'Apple Music player')}"
      loading="lazy"
      allow="autoplay *; encrypted-media *; clipboard-write"
      height="450"
    ></iframe>
  `.trim()

  return createEmbedMarkup({
    provider: 'applemusic',
    iframe,
    fallbackHref: url.toString(),
    fallbackLabel: title,
  })
}

function buildSpotifyEmbed(url, { title }) {
  const hostname = url.hostname.toLowerCase()
  if (!hostname.endsWith('spotify.com')) {
    return null
  }

  const pathSegments = url.pathname.split('/').filter(Boolean)
  if (pathSegments.length === 0) {
    return null
  }

  const embedUrl = new URL(url.toString())
  embedUrl.pathname = `/embed/${pathSegments.join('/')}`

  const iframe = `
    <iframe
      src="${embedUrl.toString()}"
      title="${escapeHtml(title || 'Spotify player')}"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      height="352"
    ></iframe>
  `.trim()

  return createEmbedMarkup({
    provider: 'spotify',
    iframe,
    fallbackHref: url.toString(),
    fallbackLabel: title,
  })
}

const builders = [buildYouTubeEmbed, buildBandcampEmbed, buildSoundCloudEmbed, buildAppleMusicEmbed, buildSpotifyEmbed]

export function resolveEmbed(urlString, { title, description } = {}) {
  const url = tryParseUrl(urlString)
  if (!url) {
    return null
  }

  for (const builder of builders) {
    const embed = builder(url, { title, description })
    if (embed) {
      return embed
    }
  }

  return null
}
