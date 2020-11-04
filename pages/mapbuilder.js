import PageLayout from 'wrappers/page';
import MapBuilder from 'layouts/mapbuilder';

import { getPostsByType, getPostByType } from 'services/content';

const MapBuilderPage = (props) => (
  <PageLayout {...props}>
    <MapBuilder {...props} />
  </PageLayout>
);

export async function getStaticProps() {
  const page = await getPostByType({
    type: 'pages',
    slug: 'mapbuilder',
  });

  const apps = await getPostsByType({
    type: 'apps',
    params: {
      per_page: 100,
    },
  });

  const tutorials = await getPostsByType({
    type: 'articles',
    params: {
      per_page: 6,
      help_tools_includes: 1252,
    },
  });

  return {
    props: {
      page: page || {},
      tutorials: tutorials || [],
      apps: apps || [],
      metaTags: page?.yoast_head || '',
    },
  };
}

export default MapBuilderPage;
