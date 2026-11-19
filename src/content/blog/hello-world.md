---
title: 你好，世界
description: 这个博客的第一篇文章，简单记录它用了什么、怎么写作。
pubDate: 2026-11-19
tags: ["随笔", "Astro"]
---

这是博客的第一篇文章。

## 为什么用 Astro

这个站点在构建时就把 Markdown 渲染成 HTML，浏览器拿到的就是完整内容，所以首屏快、SEO 友好，也不需要维护文章列表。交互只用在真正需要的地方，比如主题切换和搜索。

核心组成：

- Astro：静态站点生成与路由
- Tailwind CSS：样式
- Shiki：构建期代码高亮
- KaTeX：数学公式
- Pagefind：静态全文搜索
- GitHub Actions：构建并发布到 GitHub Pages

## 一个代码块

```ts
type Post = {
	title: string;
	pubDate: Date;
	tags: string[];
};

export function sortByDate(posts: Post[]): Post[] {
	return [...posts].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
```

## 怎么写新文章

在 `src/content/blog/` 下新建 `.md` 文件，写好 frontmatter，然后 `git push` 即可。构建会自动生成列表、标签页、归档和 RSS。
