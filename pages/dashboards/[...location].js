import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import ConfirmationMessage from 'components/confirmation-message';

import getLocationData from 'app/location';

export const getServerSideProps = getLocationData;

const DashboardsLocationPage = (props) => (
  <Layout {...props}>
    {props.locationName.includes('not found') ? (
      <ConfirmationMessage title={props.locationName} error large />
    ) : (
      props.locationName
    )}
  </Layout>
);

DashboardsLocationPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default DashboardsLocationPage;
