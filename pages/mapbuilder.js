import Layout from 'layouts/page';
import MapBuilder from 'pages/mapbuilder';

import { getPostsByType } from 'services/content';

// eslint-disable-next-line react/prop-types
const MapBuilderPage = ({ tutorials }) => (
  <Layout title="MapBuilder | Global Forest Watch" description="Mapbuilder">
    <MapBuilder tutorials={tutorials} />
  </Layout>
);

export async function getStaticProps() {
  const tutorials = await getPostsByType({
    type: 'articles',
    params: {
      per_page: 6,
      help_tools_includes: 1252,
    },
  });

  return {
    props: {
      tutorials: tutorials || [],
    },
  };
}

export default MapBuilderPage;
