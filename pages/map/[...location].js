import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import ConfirmationMessage from 'components/confirmation-message';

import config from 'app/config';

export const getServerSideProps = async ({ params }) => {
  const location = {
    type: params.location[0],
    adm0: params.location[1],
    adm1: params.location[2],
    adm2: params.location[3],
  };

  let getLocationData = null;
  if (location.adm2) getLocationData = config[location.type].adm2;
  else if (location.adm1) getLocationData = config[location.type].adm1;
  else if (location.adm0) getLocationData = config[location.type].adm0;

  if ((!location.type && !location.adm0) || !getLocationData) {
    return {
      props: {
        locationName: `Location not found`,
      },
    };
  }

  try {
    const locationData = await getLocationData(location);

    return {
      props: {
        ...(locationData && {
          ...locationData,
          titleParams: locationData,
        }),
      },
    };
  } catch {
    return {
      props: {
        locationName: `Location not found`,
        titleParams: {
          locationName: `Location not found`,
        },
      },
    };
  }
};

const MapLocationPage = (props) => {
  return (
    <Layout {...props}>
      {props.locationName.includes('not found') ? (
        <ConfirmationMessage title={props.locationName} error large />
      ) : (
        props.locationName
      )}
    </Layout>
  );
};

MapLocationPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default MapLocationPage;
