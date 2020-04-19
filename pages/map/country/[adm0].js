import PropTypes from 'prop-types';
import { get } from 'axios';

import { CARTO_API } from 'utils/constants';
import { getCountriesProvider } from 'services/country';

import Layout from 'layouts/page';

export const getStaticPaths = async () => {
  const countries = await getCountriesProvider();
  const paths =
    countries.data.rows.map((c) => ({
      params: { adm0: c.iso },
    })) || [];

  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  const countryData = await get(
    `${CARTO_API}/sql?q=SELECT iso, name_engli as name FROM gadm36_countries WHERE iso = '${params.adm0}' AND iso != 'XCA' AND iso != 'TWN'`
  );
  const { name: locationName } = countryData?.data?.rows?.[0];

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
