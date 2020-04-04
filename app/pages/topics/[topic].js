import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import Layout from 'layouts/page';
import Topics from 'layouts/topics';
import routes from 'app/routes';

export const getStaticPaths = async () => {
  const paths = routes['/topics/[topic]'].allowedParams.topic.map((key) => ({
    params: { topic: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => ({
  props: {
    titleParams: {
      topic: params ? capitalize(params.topic) : '',
    },
  },
});

const TopicPage = (props) => {
  return (
    <Layout {...props}>
      <Topics />
    </Layout>
  );
};

TopicPage.propTypes = {
  titleParams: PropTypes.object.isRequired,
};

export default TopicPage;
