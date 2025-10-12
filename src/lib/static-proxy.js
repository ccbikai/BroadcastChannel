const DEFAULT_STATIC_PROXY = '/static/'

function normalizeStaticProxy(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  const base = raw.length > 0 ? raw : DEFAULT_STATIC_PROXY
  return base.endsWith('/') ? base : `${base}/`
}

const ABSOLUTE_HTTP_REGEX = /^(?:https?:)?\/\//iu
const NON_PROXY_PREFIX_REGEX = /^(?:data:|blob:)/iu

function toProxyUrl(staticProxy, target) {
  if (typeof target !== 'string') {
    return ''
  }

  const trimmed = target.trim()
  if (trimmed.length === 0) {
    return ''
  }

  if (NON_PROXY_PREFIX_REGEX.test(trimmed)) {
    return trimmed
  }

  const normalizedProxy = normalizeStaticProxy(staticProxy)

  if (trimmed.startsWith(normalizedProxy)) {
    return trimmed
  }

  if (ABSOLUTE_HTTP_REGEX.test(trimmed)) {
    const normalizedTarget = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed
    return `${normalizedProxy}${normalizedTarget}`
  }

  const normalizedTarget = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${normalizedProxy}${normalizedTarget}`
}

export { normalizeStaticProxy, toProxyUrl }
