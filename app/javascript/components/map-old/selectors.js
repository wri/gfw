import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

// get list data
const getLayerSlugs = state => state.layers || null;
const getLayerSpec = state => state.layerSpec || null;

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
