export type ResolvedEmbed = { html: string }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

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
      const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
      return {
        html: `<iframe loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen src="${esc(src)}" style="width:100%;height:360px;border:0;"></iframe>`,
      }
    }

    // Spotify
    if (/(^|\.)open\.spotify\.com$/.test(u.hostname)) {
      const src = `https://open.spotify.com/embed${u.pathname}${u.search || ''}`
      return {
        html: `<iframe loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="${esc(src)}" style="width:100%;height:352px;border:0;"></iframe>`,
      }
    }

    // Apple Music
    if (/(^|\.)music\.apple\.com$/.test(u.hostname)) {
      const src = `https://embed.music.apple.com${u.pathname}${u.search || ''}`
      return {
        html: `<iframe loading="lazy" allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${esc(src)}" style="width:100%;height:450px;border:0;"></iframe>`,
      }
    }

    // Bandcamp (embedded player with ?url=)
    if (/bandcamp\.com$/.test(u.hostname)) {
      const src = `https://bandcamp.com/EmbeddedPlayer/url=${encodeURIComponent(rawUrl)}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/`
      return { html: `<iframe loading="lazy" src="${esc(src)}" style="width:100%;height:472px;border:0;" seamless></iframe>` }
    }

    // SoundCloud (handled in server loader via oEmbed; return a token to trigger fetch)
    if (/(^|\.)soundcloud\.com$/.test(u.hostname)) {
      const oembed = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}&maxheight=166&show_artwork=true`
      return { html: `<!-- SOUNDCloud_OEMBED ${esc(oembed)} -->` }
    }

    return null
  }
  catch {
    return null
  }
}
