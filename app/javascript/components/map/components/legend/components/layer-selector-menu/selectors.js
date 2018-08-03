import { createSelector, createStructuredSelector } from 'reselect';

const getLayerGroup = state => state.layerGroup || null;
const getLayers = state => state.layers || null;

export const getLayerOptions = createSelector(getLayerGroup, layerGroup => {
  if (!layerGroup) return null;
  return layerGroup.layers.map(l => l.applicationConfig.selectorConfig);
});

export const getActiveLayer = createSelector(
  [getLayerGroup, getLayers],
  (layerGroup, layers) => {
    if (!layerGroup || !layers) return null;
    const layerId = layers.find(l => l.dataset === layerGroup.dataset)
      .layers[0];
    return layerGroup.layers.find(
      l => (layerId ? l.id === layerId : l.applicationConfig.default)
    );
  }
);

export const getSelectedLayer = createSelector(getActiveLayer, layer => {
  if (!layer) return null;
  return layer.applicationConfig.selectorConfig;
});

export const getLayerSelectorProps = createStructuredSelector({
  options: getLayerOptions,
  activeLayerd: getActiveLayer,
  selectedOption: getSelectedLayer
});
