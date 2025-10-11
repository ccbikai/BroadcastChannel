const PUNCTUATION_REGEX = /[\p{P}\p{S}]+/gu
const HASHTAG_REGEX = /#[\p{L}\p{N}_-]+/gu

export function normalizeTag(tag = '') {
  if (typeof tag !== 'string') {
    return ''
  }

  const lowerCased = tag
    .trim()
    .replace(/^#+/u, '')
    .toLowerCase()

  const normalized = lowerCased.normalize('NFKC')

  return normalized.replace(PUNCTUATION_REGEX, '').trim()
}

export function extractTagsFromText(text = '') {
  if (typeof text !== 'string' || text.length === 0) {
    return []
  }

  const matches = text.match(HASHTAG_REGEX) ?? []
  const uniqueTags = new Set()

  for (const match of matches) {
    const normalized = normalizeTag(match)
    if (normalized) {
      uniqueTags.add(normalized)
    }
  }

  return Array.from(uniqueTags)
}
