import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMainMapSettings = (state) => state.mainMap;
export const selectMapMenuSettings = (state) => state.mapMenu?.settings;
export const selectAnalysisSettings = (state) => state.analysis?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectRecentImagerySettings = (state) =>
  state.recentImagery?.settings;
export const selectMapPromptsSettings = (state) => state.mapPrompts?.settings;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMainMapSettings,
    selectMapMenuSettings,
    selectAnalysisSettings,
    selectMetaModalKey,
    selectRecentImagerySettings,
    selectMapPromptsSettings,
  ],
  (map, mainMap, mapMenu, analysis, modalMeta, recentImagery, mapPrompts) => ({
    map,
    mainMap,
    mapMenu,
    analysis,
    modalMeta,
    recentImagery,
    mapPrompts,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
