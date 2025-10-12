export type EmbedTheme = 'dark' | 'light' | 'auto'

export type EmbedSpec = {
  title: string
  src: string
  width: number
  height: number
  heightSmall?: number | null
  sandbox?: string
  allow?: string
  referrerPolicy?: string
  cspOkHosts: string[]
  theme: EmbedTheme
}

const DEFAULT_THEME: EmbedTheme = 'dark'

function getEmbedTheme(): EmbedTheme {
  const raw = (import.meta.env.EMBED_THEME ?? DEFAULT_THEME).toString().toLowerCase()
  if (raw === 'light' || raw === 'auto' || raw === 'dark') {
    return raw
  }
  return DEFAULT_THEME
}

const embedTheme = getEmbedTheme()

function extractYouTubeId(url: URL): string | null {
  if (url.hostname === 'youtu.be') {
    const pathId = url.pathname.replace(/^\//u, '').split('/')[0]
    return sanitizeYouTubeId(pathId)
  }

  if (url.hostname === 'youtube.com' || url.hostname.endsWith('.youtube.com')) {
    if (url.searchParams.has('v')) {
      return sanitizeYouTubeId(url.searchParams.get('v'))
    }

    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] === 'shorts' || parts[0] === 'embed') {
      return sanitizeYouTubeId(parts[1])
    }

    if (parts.length > 0) {
      return sanitizeYouTubeId(parts[parts.length - 1])
    }
  }

  return null
}

function sanitizeYouTubeId(id: string | null | undefined): string | null {
  if (!id) return null
  const trimmed = id.trim()
  if (!trimmed) return null
  const match = trimmed.match(/^[\w-]{6,}$/u)
  return match ? match[0] : null
}

function buildYouTubeSpec(rawUrl: string): EmbedSpec | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return null
  }

  if (url.hostname === 'youtu.be' || url.hostname === 'youtube.com' || url.hostname.endsWith('.youtube.com')) {
    const id = extractYouTubeId(url)
    if (!id) return null

    const src = new URL(`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`)
    src.searchParams.set('rel', '0')
    src.searchParams.set('modestbranding', '1')
    src.searchParams.set('playsinline', '1')
    src.searchParams.set('color', embedTheme === 'light' ? 'red' : 'white')

    return {
      title: 'YouTube video player',
      src: src.toString(),
      width: 16,
      height: 9,
      sandbox: 'allow-scripts allow-same-origin allow-presentation',
      allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
      cspOkHosts: ['https://www.youtube-nocookie.com'],
      theme: embedTheme,
    }
  }

  return null
}

function buildBandcampSpec(rawUrl: string): EmbedSpec | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return null
  }

  if (!url.hostname.endsWith('bandcamp.com')) {
    return null
  }

  const src = new URL('https://bandcamp.com/EmbeddedPlayer/')
  src.searchParams.set('size', 'small')
  src.searchParams.set('artwork', 'small')
  src.searchParams.set('tracklist', 'false')
  src.searchParams.set('transparent', 'true')

  if (embedTheme === 'light') {
    src.searchParams.set('bgcol', 'FFFFFF')
    src.searchParams.set('linkcol', '000000')
  }
  else {
    src.searchParams.set('bgcol', '000000')
    src.searchParams.set('linkcol', 'ffffff')
  }

  src.searchParams.set('url', rawUrl)

  return {
    title: 'Bandcamp player',
    src: src.toString(),
    width: 320,
    height: 120,
    sandbox: 'allow-scripts allow-same-origin',
    allow: 'autoplay; encrypted-media',
    cspOkHosts: ['https://bandcamp.com'],
    theme: embedTheme,
  }
}

function buildSoundCloudSpec(rawUrl: string): EmbedSpec | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return null
  }

  if (!(url.hostname === 'soundcloud.com' || url.hostname.endsWith('.soundcloud.com') || url.hostname === 'on.soundcloud.com')) {
    return null
  }

  const src = new URL('https://w.soundcloud.com/player/')
  src.searchParams.set('url', rawUrl)
  src.searchParams.set('visual', 'false')
  src.searchParams.set('auto_play', 'false')
  src.searchParams.set('show_comments', 'false')
  src.searchParams.set('show_user', 'true')
  src.searchParams.set('show_reposts', 'false')
  src.searchParams.set('color', embedTheme === 'light' ? '#000000' : '#ffffff')

  return {
    title: 'SoundCloud player',
    src: src.toString(),
    width: 320,
    height: 166,
    sandbox: 'allow-scripts allow-same-origin',
    allow: 'autoplay',
    cspOkHosts: ['https://w.soundcloud.com'],
    theme: embedTheme,
  }
}

function getSpotifyHeight(path: string[]): number {
  const type = path[0]?.toLowerCase()
  if (type === 'track' || type === 'episode') {
    return 152
  }
  return 232
}

function buildSpotifySpec(rawUrl: string): EmbedSpec | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return null
  }

  if (!(url.hostname === 'open.spotify.com' || url.hostname.endsWith('.spotify.com'))) {
    return null
  }

  let resourcePath = url.pathname
  if (!resourcePath.startsWith('/embed/')) {
    resourcePath = `/embed${resourcePath}`
  }

  const src = new URL(`https://open.spotify.com${resourcePath}${url.search || ''}`)
  src.searchParams.set('theme', embedTheme === 'light' ? '1' : '0')

  const pathParts = resourcePath.replace(/^\/embed\/?/u, '').split('/').filter(Boolean)
  const heightSmall = getSpotifyHeight(pathParts)

  return {
    title: 'Spotify player',
    src: src.toString(),
    width: 352,
    height: heightSmall,
    heightSmall,
    sandbox: 'allow-scripts allow-same-origin',
    allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture',
    cspOkHosts: ['https://open.spotify.com'],
    theme: embedTheme,
  }
}

function buildAppleMusicSpec(rawUrl: string): EmbedSpec | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return null
  }

  if (!(url.hostname === 'music.apple.com' || url.hostname.endsWith('.music.apple.com'))) {
    return null
  }

  const src = new URL(`https://embed.music.apple.com${url.pathname}${url.search || ''}`)
  src.searchParams.set('theme', embedTheme === 'light' ? 'light' : 'dark')

  return {
    title: 'Apple Music player',
    src: src.toString(),
    width: 320,
    height: 160,
    heightSmall: 160,
    sandbox: 'allow-scripts allow-same-origin',
    allow: 'autoplay *; encrypted-media *',
    cspOkHosts: ['https://embed.music.apple.com'],
    theme: embedTheme,
  }
}

const BUILDERS = [buildYouTubeSpec, buildSpotifySpec, buildAppleMusicSpec, buildBandcampSpec, buildSoundCloudSpec]

export function detectEmbed(rawUrl: string): EmbedSpec | null {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0) {
    return null
  }

  for (const build of BUILDERS) {
    const spec = build(rawUrl)
    if (spec) {
      return spec
    }
  }

  return null
}

export const EMBED_CSP_HOSTS = [
  'https://www.youtube-nocookie.com',
  'https://bandcamp.com',
  'https://w.soundcloud.com',
  'https://open.spotify.com',
  'https://embed.music.apple.com',
]
