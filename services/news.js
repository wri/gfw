import { getPostsByType } from './content';

export const getNewsArticles = async () => {
  try {
    const posts = await getPostsByType({ type: 'new-from-gfw' });

    return JSON.parse(JSON.stringify(posts));
  } catch (_) {
    return null;
  }
};
