import { getPostsByType } from './content';

export const getImpactProjects = async () => {
  try {
    const posts = await getPostsByType({ type: 'impacts-card' });

    return JSON.parse(JSON.stringify(posts));
  } catch (_) {
    return null;
  }
};
