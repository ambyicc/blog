import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 已发布文章，按日期从新到旧排列 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 中文按字数、英文按词数估算阅读时长（分钟） */
export function readingTime(text: string): number {
	const cjk = (text.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) ?? []).length;
	const latin = text
		.replace(/[\u4e00-\u9fff\u3040-\u30ff]/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.round(cjk / 350 + latin / 200));
}

export function getReadingTime(post: Post): number {
	return readingTime(post.body ?? '');
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('zh-CN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

/** 归档页按年份分组 */
export function groupByYear(posts: Post[]): [string, Post[]][] {
	const groups = new Map<string, Post[]>();
	for (const post of posts) {
		const year = String(post.data.pubDate.getFullYear());
		groups.set(year, [...(groups.get(year) ?? []), post]);
	}
	return [...groups.entries()];
}

/** 标签及出现次数，按次数降序、同次数按名称排序 */
export function getAllTags(posts: Post[]): [string, number][] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}
