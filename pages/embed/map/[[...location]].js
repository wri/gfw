import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';
import { decodeQueryParams } from 'utils/url';

import MapUrlProvider from 'providers/map-url-provider';

import LayoutEmbed from 'wrappers/embed';
import MapEmbed from 'layouts/embed/map';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';

import {
  getStaticProps as getProps,
  getStaticPaths as getPaths,
} from '../../map/[[...location]]';

export const getStaticProps = getProps;
export const getStaticPaths = getPaths;

const MapEmbedPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath, isFallback } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useEffect(() => {
    const { map, mainMap, mapMenu, analysis, modalMeta, recentImagery } =
      decodeQueryParams(query) || {};

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
  }, [fullPathname, isFallback]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <LayoutEmbed
      {...props}
      exploreLink={ready ? asPath?.replace('/embed', '') : '/embed/map/'}
    >
      {ready && (
        <>
          <MapUrlProvider />
          <MapEmbed />
        </>
      )}
    </LayoutEmbed>
  );
};

export default MapEmbedPage;
