import type { APIRoute } from 'astro';
import { BASE_PATH, SITE_URL } from '../consts';

export const GET: APIRoute = () => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${SITE_URL}${BASE_PATH}/sitemap-index.xml`,
		'',
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
