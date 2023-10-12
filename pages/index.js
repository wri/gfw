import PageLayout from 'wrappers/page';
import SeoSearchBox from 'wrappers/seo/searchBox';

import PropTypes from 'prop-types';

import Home from 'layouts/home';

import { getNewsArticles } from 'services/news';
import { getPublishedNotifications } from 'services/notifications';

const HomePage = (props) => (
  <PageLayout
    title="Forest Monitoring, Land Use & Deforestation Trends | Global Forest Watch"
    description="Global Forest Watch offers free, real-time data, technology and tools for monitoring the world’s forests, enabling better protection against illegal deforestation and unsustainable practices."
    notifications={props.notifications}
  >
    <SeoSearchBox
      title="Forest Monitoring, Land Use & Deforestation Trends | Global Forest Watch"
      description="Global Forest Watch offers free, real-time data, technology and tools for monitoring the world’s forests, enabling better protection against illegal deforestation and unsustainable practices."
    />
    <Home {...props} />
  </PageLayout>
);

export const getStaticProps = async () => {
  const newsArticles = await getNewsArticles();
  const notifications = await getPublishedNotifications();

  return {
    props: {
      news: newsArticles || [],
      notifications: notifications || [],
    },
    revalidate: 10,
  };
};

HomePage.propTypes = {
  notifications: PropTypes.array,
};

export default HomePage;
