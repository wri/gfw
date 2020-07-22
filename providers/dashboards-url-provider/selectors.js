import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectDashboardPrompts = (state) =>
  state.dashboardPrompts?.settings;
export const selectWidgetSettings = (state) => state.widgets?.settings;
export const selectWidgetsCategory = (state) => state.widgets?.category;
export const selectAOIModalSettings = (state) => state.areaOfInterestModal;
export const selectShowMap = (state) => state.widgets?.showMap;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMetaModalKey,
    selectDashboardPrompts,
    selectWidgetSettings,
    selectWidgetsCategory,
    selectAOIModalSettings,
    selectShowMap,
  ],
  (
    map,
    modalMeta,
    dashboardPrompts,
    widgetsSettings,
    category,
    areaOfInterestModal,
    showMap
  ) => {
    return {
      map,
      modalMeta,
      dashboardPrompts,
      ...widgetsSettings,
      category,
      areaOfInterestModal,
      showMap,
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
