import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import {
  filterWidgetsByCategoryAndLayers,
  getActiveWidget
} from 'components/widgets/selectors';

// get list data
const selectLoading = state =>
  (state.mapOld && state.mapOld.loading) ||
  (state.geostore && state.geostore.loading);
const selectError = state => state.mapOld && state.mapOld.error;
const selectQuery = state => state.location && state.location.query;
const selectMapOptions = state => state.mapOld && state.mapOld.options;
const selectSettings = state => state.mapOld && state.mapOld.settings;
const selectLayerSlugs = state =>
  (state.mapOld && state.mapOld.layerSpec) || null;
const selectGeojson = state =>
  (state.geostore.data && state.geostore.data.geojson) || null;
const selectBounds = state =>
  (state.geostore.data && state.geostore.data.bounds) || null;

export const getMapSettings = createSelector(
  [
    selectSettings,
    filterWidgetsByCategoryAndLayers,
    getActiveWidget,
    selectQuery
  ],
  (settings, widgets, widget, query) => {
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
