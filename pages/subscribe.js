import PageWrapper from 'wrappers/page';
import Subscribe from 'pages/subscribe';

const SubscribePage = () => (
  <PageWrapper
    noIndex
    title="Stay Updated on the World's Forests | Global Forest Watch"
    description="Subscribe to monthly GFW newsletters and updates based on your interests."
  >
    <Subscribe />
  </PageWrapper>
);

export default SubscribePage;
