import PageLayout from 'wrappers/page';
import Home from 'layouts/home';

import { getNewsArticles } from 'services/news';

const HomePage = (props) => (
  <PageLayout
    title="Forest Monitoring, Land Use & Deforestation Trends | Global Forest Watch"
    description="Global Forest Watch offers free, real-time data, technology and tools for monitoring the world’s forests, enabling better protection against illegal deforestation and unsustainable practices."
  >
    <Home {...props} />
  </PageLayout>
);

export const getStaticProps = async () => {
  const newsArticles = await getNewsArticles();

  return {
    props: {
      news: newsArticles || [],
    },
  };
};

export default HomePage;
