import PageLayout from 'wrappers/page';
import MyGfw from 'layouts/my-gfw';

import PropTypes from 'prop-types';

import { getPublishedNotifications } from 'services/notifications';

const MyGfwPage = (props) => (
  <PageLayout
    title="My GFW | Global Forest Watch"
    description="Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use."
    noIndex
    notifications={props.notifications}
  >
    <MyGfw />
  </PageLayout>
);

export const getStaticProps = async () => {
  const notifications = await getPublishedNotifications({});

  return {
    props: {
      notifications: notifications || [],
    },
  };
};

MyGfwPage.propTypes = {
  notifications: PropTypes.array,
};

export default MyGfwPage;
