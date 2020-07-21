import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectDashboardPrompts = (state) =>
  state.dashboardPrompts?.settings;
export const selectWidgetSettings = (state) => state.widgets?.settings;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMetaModalKey,
    selectDashboardPrompts,
    selectWidgetSettings,
  ],
  (map, modalMeta, dashboardPrompts, widgetsSettings) => {
    return {
      map,
      modalMeta,
      dashboardPrompts,
      ...widgetsSettings,
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
