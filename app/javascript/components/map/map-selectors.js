import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import initialState from './map-initial-state';

// get list data
const getLayerSlugs = state => state.layers || null;
const getLayerSpec = state => state.layerSpec || null;
const getMapUrlState = state => (state.query && state.query.map) || null;

// get lists selected
export const getLayers = createSelector(
  [getLayerSlugs, getLayerSpec],
  (layers, layerSpec) => {
    if (!layers || isEmpty(layers)) return null;
    return layers.map(l => ({
      slug: l,
      ...layerSpec[l]
    }));
  }
);

// get map settings
export const getMapSettings = createSelector(getMapUrlState, urlState => ({
  ...initialState,
  ...urlState
}));
