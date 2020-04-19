import PropTypes from 'prop-types';
import { get } from 'axios';

import { CARTO_API } from 'utils/constants';

import Layout from 'layouts/page';

export const getServerSideProps = async ({ params }) => {
  const regionData = await get(
    `${CARTO_API}/sql?q=SELECT gid_2, name_0 as adm0, name_1 as adm1, name_2 as adm2 FROM gadm36_adm2 WHERE gid_2 = '${params.adm0}.${params.adm1}.${params.adm2}_1' AND iso != 'XCA' AND iso != 'TWN'`
  );
  const { adm0, adm1, adm2 } = regionData?.data?.rows?.[0];
  const locationName = `${adm2}, ${adm1}, ${adm0}`;

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
