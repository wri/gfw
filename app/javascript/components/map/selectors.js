import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import {
  filterWidgetsByCategory,
  getActiveWidget
} from 'components/widgets-v2/selectors';

// get list data
const selectLoading = state => state.map.loading || state.geostore.loading;
const selectError = state => state.map.error;
const selectMapOptions = state => state.map.options;
const selectSettings = state => state.map.settings;
const selectLayerSlugs = state => state.map.layerSpec || null;
const selectGeojson = state =>
  (state.geostore.geostore && state.geostore.geostore.geojson) || null;
const selectBounds = state =>
  (state.geostore.geostore && state.geostore.geostore.bounds) || null;

export const getMapSettings = createSelector(
  [selectSettings, filterWidgetsByCategory, getActiveWidget],
  (settings, widgets, widget) => {
    const activeWidget = widgets.find(w => w.widget === widget);
    const widgetSettings = activeWidget && activeWidget.settings;

    return {
      ...settings,
      ...widgetSettings
    };
  }
);

export const getMapLayers = createSelector(
  [getMapSettings],
  settings => settings && settings.layers
);

export const getLayers = createSelector(
  [getMapLayers, selectLayerSlugs],
  (layers, layerSpec) => {
    if (isEmpty(layers)) return null;

    return layers.map(l => ({
      slug: l,
      ...layerSpec[l]
    }));
  }
);

export const getMapProps = createStructuredSelector({
  layers: getLayers,
  loading: selectLoading,
  error: selectError,
  bounds: selectBounds,
  geojson: selectGeojson,
  options: selectMapOptions,
  settings: getMapSettings,
  layersKeys: getMapLayers,
  layerSpec: selectLayerSlugs
});
