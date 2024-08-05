# 广播频道

**将你的 Telegram Channel 转为微博客。**

---

[English](./README.md) | 简体中文

## ✨ 特性

- **将 Telegram Channel 转为微博客**
- **SEO 友好**
- **浏览器端 0 JS**
- **提供 RSS 和 RSS JSON**

## 🪧 演示

广播频道支持部署在 Cloudflare、Netlify、Vercel 等支持 Node.js SSR 的无服务器平台或者 VPS。
具体教程见[部署你的 Astro 站点](https://docs.astro.build/zh-cn/guides/deploy/)。

1. [Cloudflare](https://broadcast-channel.pages.dev/)
2. [Netlify](https://broadcast-channel.netlify.app/)
3. [Vercel](https://broadcast-channel.vercel.app/)

## 🧱 技术栈

- 框架：[Astro](https://astro.build/)
- 内容管理系统：[Telegram Channels](https://telegram.org/tour/channels)
- 模板: [Sepia](https://github.com/Planetable/SiteTemplateSepia)

## 🏗️ 部署

1. [Fork](https://github.com/ccbikai/BroadcastChannel/fork) 此项目到你 GitHub
2. 在 Cloudflare/Netlify/Vercel 创建项目
3. 选择 `BroadcastChannel` 项目和 `Astro` 框架
4. 配置环境变量 `CHANNEL` 为你的频道名称。此为最小化配置，更多配置见下面的配置项
5. 保存并部署
6. 绑定域名（可选）。
7. 更新代码，参考 GitHub 官方文档 [从 Web UI 同步分叉分支](https://docs.github.com/zh/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-branch-from-the-web-ui)。

## ⚒️ 配置

```env
## Telegram 频道名称，必须配置
CHANNEL=Broadcast_Channel_Blog

## 语言和时区设置，语言选项见[dayjs](https://github.com/iamkun/dayjs/tree/dev/src/locale)
LOCALE=zh-cn
TIMEZONE="Asia/Shanghai"

## 社交媒体用户名
TELEGRAM=ccbikai
TWITTER=ccbikai
GITHUB=ccbikai

## 下面两个社交媒体需要为 URL
DISCORD=https://DISCORD.com
PODCASRT=https://PODCASRT.com

## 头部尾部代码注入，支持 HTML
FOOTER_INJECT=FOOTER_INJECT
HEADER_INJECT=HEADER_INJECT

## SEO 配置项，可不让搜索引擎索引内容
NO_FOLLOW=false
NO_INDEX=false

## Sentry 配置项，收集服务端报错
SENTRY_AUTH_TOKEN=SENTRY_AUTH_TOKEN
SENTRY_DSN=SENTRY_DSN
SENTRY_PROJECT=SENTRY_PROJECT

## Telegram 主机名称和静态资源代理，不建议修改
HOST="telegram.dog"
STATIC_PROXY=""
```

## ☕ 赞助

1. [在 Telegram 关注我](https://t.me/miantiao_me)
2. [在 𝕏 上关注我](https://x.com/ccbikai)
3. [在 GitHub 赞助我](https://github.com/sponsors/ccbikai)
