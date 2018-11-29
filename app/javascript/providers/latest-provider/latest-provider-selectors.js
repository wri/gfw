import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveLayers } from 'components/map-v2/selectors';

const getLatestEndpoints = createSelector(getActiveLayers, layers => {
  if (!layers || !layers.length) return [];
  return (
    layers &&
    !!layers.length &&
    layers.reduce((arr, next) => {
      const latestUrl =
        (next.params && next.params.latestUrl) ||
        (next.decodeParams && next.decodeParams.latestUrl);
      return latestUrl
        ? [
          ...arr,
          {
            latestUrl,
            id: next.id
          }
        ]
        : arr;
    }, [])
  );
});

export const getLatestProps = createStructuredSelector({
  latestEndpoints: getLatestEndpoints
});
