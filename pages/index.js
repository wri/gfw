import PageWrapper from 'layouts/page';
import Home from 'pages/home';

import { getNewsProvider } from 'services/news';

const HomePage = (props) => (
  <PageWrapper
    title="Forest Monitoring, Land Use & Deforestation Trends | Global Forest Watch"
    description="Global Forest Watch offers free, real-time data, technology and tools for monitoring the world’s forests, enabling better protection against illegal deforestation and unsustainable practices."
  >
    <Home {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const newsResponse = await getNewsProvider();

  return {
    props: {
      news: newsResponse?.data?.data,
    },
  };
};

export default HomePage;
