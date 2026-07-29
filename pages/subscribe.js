import PageLayout from 'wrappers/page';
import Subscribe from 'layouts/subscribe';

const SubscribePage = () => (
  <PageLayout
    title="Stay Updated on the World's Forests | Global Nature Watch"
    description="Subscribe to monthly GNW newsletters and updates based on your interests."
    noIndex
  >
    <Subscribe />
  </PageLayout>
);

export default SubscribePage;
