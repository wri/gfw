import Layout from 'wrappers/page';
import Subscribe from 'pages/subscribe';

const SubscribePage = () => (
  <Layout
    noIndex
    title="Stay Updated on the World's Forests | Global Forest Watch"
    description="Subscribe to monthly GFW newsletters and updates based on your interests."
  >
    <Subscribe />
  </Layout>
);

export default SubscribePage;
