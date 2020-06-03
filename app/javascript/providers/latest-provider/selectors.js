import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveLayers } from 'components/map/selectors';

const getLatestEndpoints = createSelector(getActiveLayers, layers => {
  if (!layers || !layers.length) return [];

  return (
    layers &&
    !!layers.length &&
    layers.reduce((arr, next) => {
      const latestUrl =
        (next.params && next.params.latestUrl) ||
        (next.decodeParams && next.decodeParams.latestUrl);
      const resolution = next.timelineConfig && next.timelineConfig.interval;

      return latestUrl
        ? [
          ...arr,
          {
            latestUrl,
            id: next.id,
            resolution
          }
        ]
        : arr;
    }, [])
  );
});

export const getLatestProps = createStructuredSelector({
  latestEndpoints: getLatestEndpoints
});
