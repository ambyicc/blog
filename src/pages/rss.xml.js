import rss from '@astrojs/rss';
import { BASE_PATH, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context) {
	const posts = await getPublishedPosts();

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: new URL(`${BASE_PATH}/`, context.site),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `${BASE_PATH}/posts/${post.id}/`,
			categories: post.data.tags,
		})),
		customData: '<language>zh-CN</language>',
	});
}
