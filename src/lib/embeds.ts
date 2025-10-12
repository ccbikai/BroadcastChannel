export type ResolvedEmbed = { html: string }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

function appendDarkModeStyles(style: string) {
  const trimmed = style.trim().replace(/;\s*$/u, '')
  return `${trimmed};color-scheme:dark;background-color:#000;`
}

export function resolveEmbed(rawUrl: string): ResolvedEmbed | null {
  try {
    const u = new URL(rawUrl)

    // YouTube (watch, youtu.be, shorts)
    if (/(^|\.)youtube\.com$/.test(u.hostname) || u.hostname === 'youtu.be') {
      const id =
        u.hostname === 'youtu.be'
          ? u.pathname.slice(1)
          : (u.searchParams.get('v') || u.pathname.split('/').pop() || '').replace(/[?&#].*$/u, '')
      if (!id) return null

      const srcUrl = new URL(`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`)
      srcUrl.searchParams.set('rel', '0')
      srcUrl.searchParams.set('color', 'white')

      return {
        html: `<iframe loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen src="${esc(srcUrl.toString())}" style="${appendDarkModeStyles('width:100%;height:360px;border:0;')}"></iframe>`,
      }
    }

    // Spotify
    if (/(^|\.)open\.spotify\.com$/.test(u.hostname)) {
      const srcUrl = new URL(`https://open.spotify.com/embed${u.pathname}${u.search || ''}`)
      srcUrl.searchParams.set('theme', '0')

      return {
        html: `<iframe loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="${esc(srcUrl.toString())}" style="${appendDarkModeStyles('width:100%;height:352px;border:0;')}"></iframe>`,
      }
    }

    // Apple Music
    if (/(^|\.)music\.apple\.com$/.test(u.hostname)) {
      const srcUrl = new URL(`https://embed.music.apple.com${u.pathname}${u.search || ''}`)
      srcUrl.searchParams.set('theme', 'dark')

      return {
        html: `<iframe loading="lazy" allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${esc(srcUrl.toString())}" style="${appendDarkModeStyles('width:100%;height:450px;border:0;')}"></iframe>`,
      }
    }

    // Bandcamp (embedded player with ?url=)
    if (/bandcamp\.com$/.test(u.hostname)) {
      const src = `https://bandcamp.com/EmbeddedPlayer/url=${encodeURIComponent(rawUrl)}/size=large/bgcol=000000/linkcol=ffffff/minimal=true/transparent=true/`
      return {
        html: `<iframe loading="lazy" src="${esc(src)}" style="${appendDarkModeStyles('width:100%;height:472px;border:0;')}" seamless></iframe>`,
      }
    }

    // SoundCloud (handled in server loader via oEmbed; return a token to trigger fetch)
    if (/(^|\.)soundcloud\.com$/.test(u.hostname)) {
      const oembed = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}&maxheight=166&show_artwork=true&color=%23212121`
      return { html: `<!-- SOUNDCloud_OEMBED ${esc(oembed)} -->` }
    }

    return null
  }
  catch {
    return null
  }
}
