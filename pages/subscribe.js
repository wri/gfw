import PageLayout from 'layouts/page';
import Subscribe from 'components/pages/subscribe';

const SubscribePage = () => (
  <PageLayout
    noIndex
    title="Stay Updated on the World's Forests | Global Forest Watch"
    description="Subscribe to monthly GFW newsletters and updates based on your interests."
  >
    <Subscribe />
  </PageLayout>
);

export default SubscribePage;
