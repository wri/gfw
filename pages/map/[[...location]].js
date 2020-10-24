import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import { getLocationData } from 'services/location';
import { getCountriesProvider } from 'services/country';

import FullscreenLayout from 'layouts/wrappers/fullscreen';
import Map from 'layouts/map';

import MapUrlProvider from 'providers/map-url-provider';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';
import { setMapPrompts } from 'components/prompts/map-prompts/actions';

const notFoundProps = {
  error: 404,
  title: 'Location Not Found | Global Forest Watch',
  errorTitle: 'Location Not Found',
};

export const getStaticProps = async ({ params }) => {
  const [type] = params?.location || [];

  if (!type || type === 'global') {
    return {
      props: {
        title: 'Interactive World Forest Map & Tree Cover Change Data | GFW',
        description:
          'Explore the state of forests worldwide by analyzing tree cover change on GFW’s interactive global forest map using satellite data. Learn about deforestation rates and other land use practices, forest fires, forest communities, biodiversity and much more.',
      },
    };
  }

  const locationData = await getLocationData(params?.location).catch((err) => {
    if (err?.response?.status === 401) {
      return {
        props: {
          error: 401,
          title: 'Area is private | Global Forest Watch',
          errorTitle: 'Area is private',
        },
      };
    }

    return {
      props: notFoundProps,
    };
  });

  const { locationName } = locationData || {};

  if (!locationName) {
    return {
      props: notFoundProps,
    };
  }

  const title = `${locationName} Interactive Forest Map ${
    params?.location?.[2] ? '' : '& Tree Cover Change Data '
  }| GFW`;
  const description = `Explore the state of forests in ${locationName} by analyzing tree cover change on GFW’s interactive global forest map using satellite data. Learn about deforestation rates and other land use practices, forest fires, forest communities, biodiversity and much more.`;
  const noIndex = !['country', 'wdpa'].includes(type);

  return {
    props: {
      title,
      description,
      noIndex,
    },
  };
};

export const getStaticPaths = async () => {
  const countryData = await getCountriesProvider();
  const { rows: countries } = countryData?.data || {};
  const countryPaths = countries.map((c) => ({
    params: {
      location: ['country', c.iso],
    },
  }));

  return {
    paths: [
      { params: { location: [] } },
      { params: { location: ['global'] } },
      ...countryPaths,
    ],
    fallback: true,
  };
};

const MapPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath, isFallback } = useRouter();
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
  }, [fullPathname, isFallback]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <FullscreenLayout {...props}>
      {ready && (
        <>
          <MapUrlProvider />
          <Map />
        </>
      )}
    </FullscreenLayout>
  );
};

export default MapPage;
