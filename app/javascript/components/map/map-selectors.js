import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';

import initialState from './map-initial-state';

// get list data
const getMapUrlState = state => (state.query && state.query.map) || null;
const getDatasets = state => state.datasets;

// get map settings
export const getMapSettings = createSelector(getMapUrlState, urlState => ({
  ...initialState,
  ...urlState
}));

export const getLayers = createSelector(
  getMapSettings,
  settings => settings.layers
);

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
                visible: l.visible,
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
  stateLayers: getLayers,
  settings: getMapSettings,
  layerGroups: getLayerGroups,
  activeLayers: getActiveLayers
});
