import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import initialState from './map-initial-state';

// get list data
const getLayerSpec = state => state.layerSpec || null;
const getWidgetSettings = state => state.widgetSettings || null;
const getMapUrlState = state => (state.query && state.query.map) || null;

// get map settings
export const getMapSettings = createSelector(getMapUrlState, urlState => ({
  ...initialState,
  ...urlState
}));

export const getActiveLayers = createSelector(
  [getMapSettings, getWidgetSettings],
  (mapSettings, widgetSettings) => {
    if (isEmpty(mapSettings)) return null;
    return (widgetSettings && widgetSettings.layers) || mapSettings.layers;
  }
);

// get lists selected
export const getLayers = createSelector(
  [getActiveLayers, getLayerSpec],
  (layers, layerSpec) => {
    if (!layers || isEmpty(layers)) return null;
    return layers.map(l => ({
      slug: l,
      ...layerSpec[l]
    }));
  }
);

export const getMapProps = createStructuredSelector({
  layers: getLayers,
  settings: getMapSettings,
  layersKeys: getActiveLayers
});
