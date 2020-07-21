import { createSelector, createStructuredSelector } from 'reselect';

export const selectWidgetSettings = (state) => state.widgets?.settings;

export const getUrlParams = createSelector(
  [selectWidgetSettings],
  (widgetsSettings) => widgetsSettings
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
