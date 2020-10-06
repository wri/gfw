import apiFetch from '@wordpress/api-fetch';
import axios from 'axios';
import decode from 'simple-entity-decode';

const serializePosts = (posts) =>
  posts?.map((p) => {
    return {
      ...p,
      title: decode(p.title?.rendered),
      ...(p?.excerpt?.rendered && {
        excerpt: p?.excerpt?.rendered,
      }),
      ...(p?.content?.rendered && {
        content: p?.content?.rendered,
      }),
      ...(p?.acf?.post_link && {
        link: p?.acf?.post_link,
      }),
      ...(p?.acf?.alt_link && {
        link: p?.acf?.alt_link,
      }),
      ...(p.featured_media && {
        featured_media_id: p.featured_media,
        featured_media: p._embedded?.['wp:featuredmedia']?.[0],
      }),
      ...(p.help_tags && {
        tag_ids: p.help_tags,
        tags: p._embedded?.['wp:term']?.[0]?.map((tag) => ({
          ...tag,
          link: `/tag/${tag.slug}`,
        })),
      }),
      ...(p.help_tools && {
        tool_ids: p.help_tools,
        tools: p._embedded?.['wp:term']?.[1]?.map((tool) => ({
          ...tool,
          link: `/${tool.slug}`,
        })),
      }),
      ...(p.categories && {
        category_ids: p.categories,
        categories: p._embedded?.['wp:term']?.[0],
      }),
    };
  });

apiFetch.setFetchHandler(async (options) => {
  const { url, path, data, method, params } = options;

  return axios({
    url: url || path,
    method,
    data,
    params,
  });
});

export async function getPostsByType({ type, params, cancelToken } = {}) {
  const postsResponse = await apiFetch({
    url: `https://content.globalforestwatch.org/wp-json/wp/v2/${
      type || 'posts'
    }`,
    params: {
      ...params,
      _embed: true,
    },
    cancelToken,
  });
  return serializePosts(postsResponse?.data);
}
