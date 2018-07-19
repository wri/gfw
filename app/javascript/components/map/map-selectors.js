import { createSelector, createStructuredSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import flatten from 'lodash/flatten';

import initialState from './map-initial-state';

// get list data
const getMapUrlState = state => (state.query && state.query.map) || null;
const getDatasets = state => state.datasets;
const getLoading = state => state.loading;

// get map settings
export const getMapSettings = createSelector(getMapUrlState, urlState => ({
  ...initialState,
  ...urlState
}));

export const getLayers = createCachedSelector(
  getMapSettings,
  settings => settings.layers
)((state, settings) => settings);

export const getLayerGroups = createSelector(
  [getDatasets, getLayers],
  (datasets, layers) => {
    if (!datasets || !datasets.length || !layers || !layers.length) return null;
    return layers
      .map(l => {
        const dataset = datasets.find(d => d.id === l.dataset);
        return {
          ...dataset,
          layers:
            dataset.layer && dataset.layer.length > 0
              ? dataset.layer.map(layer => ({
                ...layer,
                opacity: l.opacity,
                visibility: l.visibility,
                active: l.layer === layer.id
              }))
              : []
        };
      })
      .filter(l => l.layers && l.layers.length > 0);
  }
);

export const getActiveLayers = createSelector(getLayerGroups, layerGroups => {
  if (!layerGroups || !layerGroups.length) return null;
  return flatten(layerGroups.map(d => d.layers)).filter(l => l.active);
});

export const getMapProps = createStructuredSelector({
  layers: getLayers,
  settings: getMapSettings,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers,
  loading: getLoading
});
