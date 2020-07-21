import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';

import useRouter from 'utils/router';

import LayoutEmbed from 'app/layouts/embed';
import Map from 'pages/map';

import { decodeParamsForState } from 'utils/stateToUrl';

import MapUrlProvider from 'providers/map-url-provider';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'pages/map/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';

import { getServerSideProps as getProps } from '../../map/[...location]';

export const getServerSideProps = getProps;

const MapEmbedPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useDeepCompareEffect(() => {
    const { map, mainMap, mapMenu, analysis, modalMeta, recentImagery } =
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

    if (modalMeta) {
      dispatch(setModalMetaSettings(modalMeta));
    }

    if (recentImagery) {
      dispatch(setRecentImagerySettings(recentImagery));
    }
  }, [{ fullPathname, queryPushed: query.pushed }]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <LayoutEmbed {...props} fullScreen>
      <MapUrlProvider />
      {ready && <Map embed />}
    </LayoutEmbed>
  );
};

export default MapEmbedPage;
