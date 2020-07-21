import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';

import Layout from 'layouts/page';
import Map from 'pages/map';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'pages/map/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';
import { setMapPrompts } from 'components/prompts/map-prompts/actions';
import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { setModalPlanetNoticeOpen } from 'components/modals/planet-notice/actions';

import { getLocationData } from 'services/location';

import { decodeParamsForState } from 'utils/stateToUrl';

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

const MapPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const {
      map,
      mainMap,
      mapMenu,
      analysis,
      modalMeta,
      recentImagery,
      mapPrompts,
      areaOfInterestModal,
      planetNotice,
    } = decodeParamsForState(query) || {};

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

    if (modalMeta) {
      dispatch(setModalMetaSettings(modalMeta));
    }

    if (recentImagery) {
      dispatch(setRecentImagerySettings(recentImagery));
    }

    if (mapPrompts) {
      dispatch(setMapPrompts(mapPrompts));
    }

    if (areaOfInterestModal) {
      dispatch(setAreaOfInterestModalSettings(areaOfInterestModal));
    }

    if (planetNotice) {
      dispatch(setModalPlanetNoticeOpen(planetNotice));
    }
  }, [fullPathname]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <Layout {...props} fullScreen showFooter={false}>
      <MapUrlProvider />
      {ready && <Map />}
    </Layout>
  );
};

export default MapPage;
