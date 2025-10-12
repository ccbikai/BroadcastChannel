const TELEGRAM_CDN_REGEX = /^(https?:\/\/cdn\d*\.telegram-cdn\.org\/file\/)/i

function isHttpUrl(raw: string | undefined | null): raw is string {
  return typeof raw === 'string' && /^https?:/i.test(raw.trim())
}

function getSiteHostname(): string | undefined {
  try {
    const site = (import.meta as any)?.env?.SITE
    if (!site) {
      return undefined
    }
    return new URL(site).hostname
  }
  catch (error) {
    return undefined
  }
}

export function needsProxy(raw: string | undefined | null): boolean {
  if (!isHttpUrl(raw)) {
    return false
  }

  if (TELEGRAM_CDN_REGEX.test(raw)) {
    return true
  }

  try {
    const sourceHost = new URL(raw).hostname
    const siteHost = getSiteHostname()
    if (!siteHost) {
      return true
    }

    return sourceHost !== siteHost
  }
  catch (error) {
    return true
  }
}

function ensureProxyBase(rawProxy?: string): string {
  if (!rawProxy) {
    return ''
  }

  const trimmed = rawProxy.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed
}

export function proxiedUrl(raw: string, staticProxyInput?: string): string {
  const source = typeof raw === 'string' ? raw.trim() : ''
  if (!source) {
    return ''
  }

  const staticProxy = ensureProxyBase(staticProxyInput ?? (import.meta as any)?.env?.STATIC_PROXY)
  if (!staticProxy || !needsProxy(source)) {
    return source
  }

  const hasQuery = staticProxy.includes('?')
  const endsWithQuery = hasQuery && /[?&]$/.test(staticProxy)

  if (hasQuery) {
    const separator = endsWithQuery ? '' : staticProxy.includes('?') ? '&' : '?'
    return `${staticProxy}${separator}url=${encodeURIComponent(source)}`
  }

  const normalized = staticProxy.endsWith('/') ? staticProxy : `${staticProxy}/`
  return `${normalized}${source}`
}

export function isPlayableAudioHref(href: string | undefined | null): boolean {
  if (typeof href !== 'string') {
    return false
  }

  return /\.(mp3|ogg|wav)(\?|#|$)/i.test(href)
}

export function guessAudioMime(url: string | undefined | null, explicitType?: string | null): string | undefined {
  if (explicitType) {
    return explicitType
  }

  if (!url) {
    return undefined
  }

  const lower = url.toLowerCase()

  if (lower.includes('.mp3')) {
    return 'audio/mpeg'
  }

  if (lower.includes('.ogg')) {
    return 'audio/ogg'
  }

  if (lower.includes('.wav')) {
    return 'audio/wav'
  }

  return undefined
}

export function getFileNameFromUrl(url: string | undefined | null): string | undefined {
  if (!url) {
    return undefined
  }

  try {
    const parsed = new URL(url)
    const pathname = parsed.pathname
    const parts = pathname.split('/')
    const filename = parts.filter(Boolean).pop()
    if (filename) {
      return decodeURIComponent(filename)
    }
  }
  catch (error) {
    // Ignore parsing errors and fallback to raw url
  }

  return undefined
}
