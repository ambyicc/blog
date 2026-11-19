# 我的博客

基于 Astro 7 的静态博客，部署在 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

开发地址：`http://localhost:4321/blog/`

## 构建

```bash
npm run build    # astro build + pagefind 索引
npm run preview
```

## 写文章

在 `src/content/blog/` 新建 Markdown 文件：

```md
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-11-19
tags: ["标签一", "标签二"]
---

正文……
```

## 部署前要改

- `astro.config.mjs`：`site` 改成你的域名，`base` 与仓库类型保持一致
- `src/consts.ts`：站点标题、描述、作者、GitHub 地址
- `src/pages/about.astro`：自我介绍
- 仓库 **Settings → Pages** 的 Source 选择 **GitHub Actions**
