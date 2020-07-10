import PropTypes from 'prop-types';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';
import Dashboards from 'pages/dashboards';

import { getLocationData } from 'services/location';

export const getServerSideProps = async (ctx) => {
  const isGlobal = ctx?.params?.location?.[0] === 'global';
  let locationData = {};

  try {
    locationData =
      (!isGlobal && (await getLocationData(ctx?.params?.location))) || {};
  } catch (err) {
    locationData = {};
  }

  const locationName = isGlobal ? 'Global' : locationData.locationName;

  return {
    props: locationName
      ? {
          title: `${
            locationName || 'Global'
          } Deforestation Rates & Statistics by Country | GFW`,
          description:
            ctx?.params?.location?.length > 1
              ? 'Explore interactive global tree cover loss charts by country. Analyze global forest data and trends, including land use change, deforestation rates and forest fires.'
              : `Explore interactive tree cover loss data charts and analyze ${locationName} forest trends, including land use change, deforestation rates and forest fires.`,
          keywords: `${locationName}, deforestation rates, statistics, interactive, data, forest trends, land use, forest cover by country, global tree cover loss`,
        }
      : {
          title: 'Dashboard not found',
        },
  };
};

const DashboardsPage = (props) => (
  <Layout {...props}>
    {props?.title === 'Dashboard not found' ? (
      <ConfirmationMessage title="Dashboard not found" error large />
    ) : (
      <Dashboards />
    )}
  </Layout>
);

DashboardsPage.propTypes = {
  title: PropTypes.string,
};

export default DashboardsPage;
