import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectDashboardPrompts = (state) =>
  state.dashboardPrompts?.settings;
export const selectWidgetSettings = (state) => state.widgets?.settings;
export const selectWidgetsCategory = (state) => state.widgets?.category;
export const selectAOIModalSettings = (state) => state.areaOfInterestModal;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMetaModalKey,
    selectDashboardPrompts,
    selectWidgetSettings,
    selectWidgetsCategory,
    selectAOIModalSettings,
  ],
  (
    map,
    modalMeta,
    dashboardPrompts,
    widgetsSettings,
    category,
    areaOfInterestModal
  ) => {
    return {
      map,
      modalMeta,
      dashboardPrompts,
      ...widgetsSettings,
      category,
      areaOfInterestModal,
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
