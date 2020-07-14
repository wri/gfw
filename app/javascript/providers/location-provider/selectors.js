import { createSelector, createStructuredSelector } from 'reselect';

export const selectLocation = (state) => state.location?.query?.location;
export const selectMapSettings = (state) => state.map?.settings;
export const selectMainMapSettings = (state) => state.mainMap;
export const selectMapMenuSettings = (state) => state.mapMenu;
export const selectAnalysisSettings = (state) => state.analysis?.settings;

export const getUrlParams = createSelector(
  [
    selectLocation,
    selectMapSettings,
    selectMainMapSettings,
    selectMapMenuSettings,
    selectAnalysisSettings,
  ],
  (location, map, mainMap, mapMenu, analysis) => ({
    location,
    map,
    mainMap,
    mapMenu,
    analysis,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
