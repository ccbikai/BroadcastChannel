# BroadcastChannel

**Turn your Telegram Channel into a MicroBlog.**

### Platform

1. [Cloudflare](https://broadcast-channel.pages.dev/)
2. [Netlify](https://broadcast-channel.netlify.app/)
3. [Vercel](https://broadcast-channel.vercel.app/)

BroadcastChannel supports deployment on serverless platforms like Cloudflare, Netlify, Vercel that support Node.js SSR, or on a VPS.
For detailed tutorials, see [Deploy your Astro site](https://docs.astro.build/en/guides/deploy/).

## 🧱 Tech Stack

- Framework: [Astro](https://astro.build/)
- CMS: [Telegram Channels](https://telegram.org/tour/channels)
- Template: [Sepia](https://github.com/Planetable/SiteTemplateSepia)

## 🏗️ Deployment

### Docker

1. `docker pull ghcr.io/ccbikai/broadcastchannel:main`
2. `docker run -d --name broadcastchannel -p 4321:4321 -e CHANNEL=miantiao_me ghcr.io/ccbikai/broadcastchannel:main`

### Serverless

1. [Fork](https://github.com/ccbikai/BroadcastChannel/fork) this project to your GitHub
2. Create a project on Cloudflare/Netlify/Vercel
3. Select the `BroadcastChannel` project and the `Astro` framework
4. Configure the environment variable `CHANNEL` with your channel name. This is the minimal configuration, for more configurations see the options below
5. Save and deploy
6. Bind a domain (optional).
7. Update code, refer to the official GitHub documentation [Syncing a fork branch from the web UI](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui).

## ⚒️ Configuration

```env
## Telegram Channel Username, must be configured. The string of characters following t.me/
CHANNEL=miantiao_me

## Language and timezone settings, language options see [dayjs](https://github.com/iamkun/dayjs/tree/dev/src/locale)
LOCALE=en
TIMEZONE=America/New_York

## Social media usernames
TELEGRAM=ccbikai
GITHUB=ccbikai

## The following social media need to be URLs
SOUNDCLOUD=https://soundcloud.com/artist
BANDCAMP=https://artist.bandcamp.com
SPOTIFY=https://open.spotify.com/artist/artist-id
APPLEMUSIC=https://music.apple.com/profile

## Header and footer code injection, supports HTML
FOOTER_INJECT=FOOTER_INJECT
HEADER_INJECT=HEADER_INJECT

## SEO configuration options, can prevent search engines from indexing content
NO_FOLLOW=false
NO_INDEX=false

## Sentry configuration options, collect server-side errors
SENTRY_AUTH_TOKEN=SENTRY_AUTH_TOKEN
SENTRY_DSN=SENTRY_DSN
SENTRY_PROJECT=SENTRY_PROJECT

## Telegram host name and static resource proxy, not recommended to modify
HOST=telegram.dog
STATIC_PROXY=

## Enable Google Site Search
GOOGLE_SEARCH_SITE=memo.miantiao.me

## Show comments
COMMENTS=true

## Enable RSS beautify
RSS_BEAUTIFY=true
```

## 🙋🏻 FAQs

1. Why is the content empty after deployment?
   - Check if the channel is public, it must be public
   - The channel username is a string, not a number
   - Turn off the "Restricting Saving Content" setting in the channel
   - Redeploy after modifying environment variables
   - Telegram blocks public display of some sensitive channels, you can verify by visiting `https://t.me/s/channelusername`.
