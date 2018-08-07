import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';

import { getLayers } from '../../map-selectors';

const getSelected = state => state.selected;
const getInteractions = state => state.interactions;
const getLatLng = state => state.latlng;

export const getActiveLayers = createSelector(
  [getLayers, getInteractions],
  (layers, interactions) => {
    if (!layers || !interactions) return null;
    const interactionLayerIds = Object.keys(interactions);
    const layerIds = flatten(layers.map(l => l.layers));
    return intersection(interactionLayerIds, layerIds);
  }
);

export const getSelectedLayer = createSelector(
  [getSelected, getActiveLayers, getInteractions],
  (selected, layers, interactions) => {
    if (selected && interactions[selected]) return selected;
    return layers[0];
  }
);

export const getLayerOptions = createSelector(
  [getActiveLayers, getInteractions],
  (layers, interactions) => {
    if (!layers || !interactions) return null;
    return layers.map(i => ({
      label: interactions[i].label,
      value: i
    }));
  }
);

export const getSelectedData = createSelector(
  [getSelectedLayer, getInteractions],
  (layer, interactions) => {
    if (!layer || !interactions || !interactions[layer]) return null;
    const { config, ...data } = interactions[layer];
    return config.map(c => ({
      label: c.property,
      value: data[c.column]
    }));
  }
);

export const getPopupProps = createStructuredSelector({
  value: getSelectedLayer,
  options: getLayerOptions,
  data: getSelectedData,
  interactions: getInteractions,
  latlng: getLatLng
});
