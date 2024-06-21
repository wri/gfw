import PageLayout from 'wrappers/page';
import MyGfw from 'layouts/my-gfw';

import PropTypes from 'prop-types';
import { parse } from 'cookie';

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

export const getServerSideProps = async (context) => {
  const notifications = await getPublishedNotifications();

  const cookies = context.req.headers.cookie || null;

  console.log('cookies', (cookies && parse(cookies)['gfw-token']) || 'empty');

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
