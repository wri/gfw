import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import ConfirmationMessage from 'components/confirmation-message';
import Map from 'layouts/map';

import getLocationData from 'app/location';

export const getServerSideProps = getLocationData;

const MapLocationPage = (props) => (
  <Layout {...props}>
    {props.locationName.includes('not found') ? (
      <ConfirmationMessage title={props.locationName} error large />
    ) : (
      <Map />
    )}
  </Layout>
);

MapLocationPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default MapLocationPage;
