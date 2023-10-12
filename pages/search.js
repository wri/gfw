import PageLayout from 'wrappers/page';
import Search from 'layouts/search';

import PropTypes from 'prop-types';

import { getPublishedNotifications } from 'services/notifications';

const SearchPage = (props) => (
  <PageLayout
    title="Search | Global Forest Watch"
    description="Search forest information, including forest data, news, updates and more."
    notifications={props.notifications}
    noIndex
  >
    <Search />
  </PageLayout>
);

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async ({ params, query, req }) => {
  const notifications = await getPublishedNotifications();

  return {
    props: {
      notifications: notifications || [],
    },
  };
};

SearchPage.propTypes = {
  notifications: PropTypes.array,
};

export default SearchPage;
