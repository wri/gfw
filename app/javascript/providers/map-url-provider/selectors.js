import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMainMapSettings = (state) => state.mainMap;
export const selectMapMenuSettings = (state) => state.mapMenu?.settings;
export const selectAnalysisSettings = (state) => state.analysis?.settings;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMainMapSettings,
    selectMapMenuSettings,
    selectAnalysisSettings,
  ],
  (map, mainMap, mapMenu, analysis) => ({
    map,
    mainMap,
    mapMenu,
    analysis,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
