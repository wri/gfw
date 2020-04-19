import PropTypes from 'prop-types';
import { get } from 'axios';

import { CARTO_API } from 'utils/constants';

import Layout from 'layouts/page';

export const getServerSideProps = async ({ params }) => {
  const regionData = await get(
    `${CARTO_API}/sql?q=SELECT iso, gid_1 as id, name_0 as adm0, name_1 as adm1 FROM gadm36_adm1 WHERE gid_1 = '${params.adm0}.${params.adm1}_1' AND iso != 'XCA' AND iso != 'TWN'`
  );
  const { adm0, adm1 } = regionData?.data?.rows?.[0];
  const locationName = `${adm1}, ${adm0}`;

  return {
    props: {
      locationName,
      titleParams: {
        locationName,
      },
    },
  };
};

const DashboardsPage = (props) => {
  return <Layout {...props}>{props.locationName}</Layout>;
};

DashboardsPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default DashboardsPage;
