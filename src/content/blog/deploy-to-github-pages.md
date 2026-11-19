---
title: 部署到 GitHub Pages
description: 从新建仓库到自动发布，记录这个博客的部署配置。
pubDate: 2026-11-10
tags: ["部署", "GitHub Pages"]
---

## 1. 新建仓库

项目站点的仓库名可以随意，例如 `blog`，访问地址是：

```text
https://<用户名>.github.io/blog/
```

因此 `astro.config.mjs` 里要设置：

```js
export default defineConfig({
	site: 'https://<用户名>.github.io',
	base: '/blog/',
});
```

如果仓库名是 `<用户名>.github.io`，则属于用户站点，`base` 改成 `/`。

## 2. 开启 Pages

进入仓库的 **Settings → Pages**，把 Source 设为 **GitHub Actions**。

## 3. 工作流

仓库里的 `.github/workflows/deploy.yml` 会在推送到 `main` 时自动构建并发布。关键步骤是：

```yaml
- run: npm ci
- run: npm run build
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist
```

`npm run build` 会先执行 `astro build`，再用 Pagefind 为 `dist` 生成搜索索引。

## 4. 注意事项

- Astro 7 要求 Node.js 22.23.4 及以上，工作流里使用 Node 22。
- 站内链接统一用 `withBase()` 生成，避免 `/blog/` 前缀丢失导致 404。
- 图片路径要带 `/blog/` 前缀，或者使用 Astro 的图片组件。
- 第一次部署完成后，在 Pages 页面确认 HTTPS 已开启。
