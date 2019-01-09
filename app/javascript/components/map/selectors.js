import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getActiveWidget, getWidgets } from 'pages/dashboards/selectors';

// get list data
const selectLoading = state =>
  (state.mapOld && state.mapOld.loading) ||
  (state.geostore && state.geostore.loading);
const selectError = state => state.mapOld && state.mapOld.error;
const selectQuery = state => state.location && state.location.query;
const selectMapOptions = state => state.mapOld && state.mapOld.options;
const selectSettings = state => state.mapOld && state.mapOld.settings;
const selectLayerSlugs = state => state.mapOld && state.mapOld.layerSpec;
const selectGeojson = state =>
  state.geostore && state.geostore.data && state.geostore.data.geojson;
const selectBounds = state =>
  state.geostore && state.geostore.data && state.geostore.data.bounds;

export const getMapSettings = createSelector(
  [selectSettings, getWidgets, getActiveWidget, selectQuery],
  (settings, widgets, widget, query) => {
    if (!widgets) return settings;
    const widgetUrlState = query && query[widget];
    const activeWidget = widgets.find(w => w.widget === widget);
    const widgetSettings = activeWidget && activeWidget.settings;

    return {
      ...settings,
      ...widgetSettings,
      ...widgetUrlState
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
    if (isEmpty(layers) || isEmpty(layerSpec)) return null;

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
