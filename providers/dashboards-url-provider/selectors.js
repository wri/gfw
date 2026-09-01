import { createSelector, createStructuredSelector } from 'reselect';

import { objDiff } from 'utils/data';

import { initialState as mapInitialState } from 'components/map/reducers';
import { initialState as dashboardPromptsInitialState } from 'components/prompts/dashboard-prompts/reducers';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalSettings = (state) => {
  const metakey = state.modalMeta?.metakey;
  const metaType = state.modalMeta?.metaType;

  return metaType ? { metakey, metaType } : metakey;
};
export const selectDashboardPrompts = (state) =>
  state.dashboardPrompts?.settings;
export const selectWidgetSettings = (state) => state.widgets?.settings;
export const selectWidgetsCategory = (state) => state.widgets?.category;
export const selectShowMap = (state) => state.widgets?.showMap;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMetaModalSettings,
    selectDashboardPrompts,
    selectWidgetSettings,
    selectWidgetsCategory,
    selectShowMap,
  ],
  (map, modalMeta, dashboardPrompts, widgetsSettings, category, showMap) => {
    return {
      map: objDiff(map, mapInitialState.settings),
      modalMeta,
      dashboardPrompts: objDiff(
        dashboardPrompts,
        dashboardPromptsInitialState.settings
      ),
      ...widgetsSettings,
      category,
      showMap,
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
