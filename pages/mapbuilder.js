import sortBy from 'lodash/sortBy';

import Layout from 'wrappers/page';
import MapBuilder from 'pages/mapbuilder';

import { getPostsByType, getPostByType } from 'services/content';

// eslint-disable-next-line react/prop-types
const MapBuilderPage = (props) => (
  <Layout title="MapBuilder | Global Forest Watch" description="Mapbuilder">
    <MapBuilder {...props} />
  </Layout>
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
      apps: sortBy(apps, 'menu_order') || [],
      metaTags: page?.yoast_head || '',
    },
  };
}

export default MapBuilderPage;
