import { createSelector, createStructuredSelector } from 'reselect';

const getSelected = state => state.selected;
const getInteractions = state => state.interactions;
const getLayers = state => state.layers;

export const getSelectedLayer = createSelector(
  [getSelected, getLayers, getInteractions],
  (selected, layers, interactions) => {
    if (selected && interactions[selected]) return selected;
    const interactionLayers = Object.keys(interactions);
    const topActiveLayer = layers.find(
      l => interactionLayers.indexOf(l.layer) > -1
    );
    return topActiveLayer && topActiveLayer.layer;
  }
);

export const getLayerOptions = createSelector(
  [getLayers, getInteractions],
  (layers, interactions) => {
    if (!layers || !interactions) return null;
    const interactionIds = Object.keys(interactions);
    const interactiveLayers = layers.filter(
      l => interactionIds.indexOf(l.layer) > -1
    );
    return interactiveLayers.map(i => ({
      label: interactions[i.layer].label,
      value: i.layer
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
  selectedLayer: getSelectedLayer,
  interactionLayers: getLayerOptions,
  data: getSelectedData
});
