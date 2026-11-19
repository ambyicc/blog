// 站点级配置：部署前主要改这里和 astro.config.mjs。
export const SITE_TITLE = '我的博客';
export const SITE_DESCRIPTION = '记录技术、项目与日常思考。';
export const SITE_AUTHOR = 'ambyicc';
export const SITE_URL = 'https://ambyicc.github.io';
export const BASE_PATH = '/blog';
export const GITHUB_URL = 'https://github.com/ambyicc';

// 生成站内链接时统一走这个函数，避免部署到 /blog/ 子路径后 404。
export const withBase = (path: string) => `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
