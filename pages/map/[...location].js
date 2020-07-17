import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/router';

import Layout from 'app/layouts/root';
import Map from 'pages/map';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'pages/map/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';

import { getLocationData } from 'services/location';

import { decodeParamsForState } from 'utils/stateToUrl';

import LocationProvider from 'providers/location-provider';
import MapUrlProvider from 'providers/map-url-provider';

export const getServerSideProps = async ({ params }) => {
  let locationData = {};
  try {
    locationData = await getLocationData(params?.location);
  } catch (err) {
    locationData = {};
  }

  const { locationName } = locationData || {};

  return {
    props: {
      title: `${
        locationName ? `${locationName} ` : ''
      }Interactive World Forest Map & Tree Cover Change Data | GFW`,
      description: `Explore the state of forests ${
        locationName ? `in ${locationName}` : 'worldwide'
      } by analyzing tree cover change on GFW’s interactive global forest map using satellite data. Learn about deforestation rates and other land use practices, forest fires, forest communities, biodiversity and much more.`,
      keywords: `${locationName}, Interactive world forest map, tree cover map, tree cover change, data, global forest cover change, satellite monitoring, deforestation, land use, forest communities, biodiversity`,
    },
  };
};

const MapPage = ({
  setMapSettings: setMap,
  setMainMapSettings: setMainMap,
  setMenuSettings: setMenu,
  setAnalysisSettings: setAnalysis,
  urlParams,
  ...props
}) => {
  const dispatch = useDispatch();
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { map, mainMap, mapMenu, analysis } =
      decodeParamsForState(query) || {};

    if (map) {
      dispatch(setMapSettings(map));
    }

    if (mainMap) {
      dispatch(setMainMapSettings(mainMap));
    }

    if (mapMenu) {
      dispatch(setMenuSettings(mapMenu));
    }

    if (analysis) {
      dispatch(setAnalysisSettings(analysis));
    }
  }, [fullPathname]);

  return (
    <Layout {...props} fullScreen showFooter={false}>
      <LocationProvider />
      <MapUrlProvider />
      <Map />
    </Layout>
  );
};

MapPage.propTypes = {
  urlParams: PropTypes.object,
  setMapSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
};

export default MapPage;
