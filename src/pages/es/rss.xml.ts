import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft && post.id.startsWith('es/'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Erick González — Atlas de sistemas',
    description: 'Notas de campo sobre rendimiento, backends, flujos de IA y construcción de productos.',
    site: context.site ?? new URL('https://vsapiens.github.io'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/es/blog/${post.id.replace(/^es\//, '')}`,
      categories: post.data.tags,
    })),
    customData: '<language>es-mx</language>',
  });
}
