import Layout from 'app/layouts/root';
import MyGfw from 'pages/my-gfw';

export default () => (
  <Layout
    title="My GFW | Global Forest Watch"
    description="Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use."
    keywords="GFW, forests, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation, subscribe"
  >
    <MyGfw />
  </Layout>
);
