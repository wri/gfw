import PropTypes from 'prop-types';

import Layout from 'layouts/page';

const DashboardsPage = (props) => (
  <Layout {...props}>
    <h1>{props.title}</h1>
  </Layout>
);

DashboardsPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default DashboardsPage;
