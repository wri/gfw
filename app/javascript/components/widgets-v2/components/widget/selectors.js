import { createSelector, createStructuredSelector } from 'reselect';
import { pluralise } from 'utils/strings';

export const selectAllPropsAndState = (state, ownProps) => ownProps;
export const selectWidgetSettings = (state, { settings }) => settings;
export const selectWidgetOptions = (state, { options }) => options;
export const selectWidgetUrlState = (state, { widget }) =>
  state.location && state.location.query && state.location.query[widget];
export const selectWidgetFromState = (state, { widget }) =>
  state.widgetsV2.widgets[widget];

export const getWidgetSettings = createSelector(
  [selectWidgetUrlState, selectWidgetSettings],
  (urlState, settings) => ({
    ...settings,
    ...urlState
  })
);

export const getWidgetPropsFromState = createSelector(
  [selectWidgetFromState, selectAllPropsAndState, getWidgetSettings],
  (widgetState, widgetProps, settings) => ({
    ...widgetProps.getProps({
      ...widgetState,
      ...widgetProps,
      settings
    })
  })
);

export const getWidgetError = createSelector(
  [selectWidgetFromState],
  props => props && props.error
);

export const getWidgetLoading = createSelector(
  [selectWidgetFromState],
  props => props && props.loading
);

export const getWidgetTitle = createSelector(
  [getWidgetPropsFromState],
  props => props && props.title
);

export const getWidgetSentence = createSelector(
  [getWidgetPropsFromState],
  props => props && props.sentence
);

export const getWidgetData = createSelector(
  [getWidgetPropsFromState],
  props => props && props.data
);

export const getWidgetDataConfig = createSelector(
  [getWidgetPropsFromState],
  props => props && props.dataConfig
);

export const getOptionsSelected = createSelector(
  [getWidgetSettings, selectWidgetOptions],
  (settings, options) => {
    if (!options || !settings) return null;
    return {
      ...Object.keys(settings).reduce((obj, settingsKey) => {
        const optionsKey = pluralise(settingsKey);
        const hasOptions = options[optionsKey];
        return {
          ...obj,
          ...(hasOptions && {
            [settingsKey]: hasOptions.find(
              o => o.value === settings[settingsKey]
            )
          })
        };
      }, {})
    };
  }
);

export const getForestType = createSelector(
  [getOptionsSelected],
  selected => selected && selected.forestType
);

export const getLandCategory = createSelector(
  [getOptionsSelected],
  selected => selected && selected.landCategory
);

export const getIndicator = createSelector(
  [getForestType, getLandCategory],
  (forestType, landCategory) => {
    if (!forestType && !landCategory) return null;
    let label = '';
    let value = '';
    if (forestType && landCategory) {
      label = `${forestType.label} in ${landCategory.label}`;
      value = `${forestType.value}__${landCategory.value}`;
    } else if (landCategory) {
      label = landCategory.label;
      value = landCategory.value;
    } else {
      label = forestType.label;
      value = forestType.value;
    }

    return {
      label,
      value
    };
  }
);

// config.options.endYear && {
//   startYears: options.years.filter(y => y.value <= settings.endYear),
//   endYears: options.years.filter(y => y.value >= settings.startYear)
// })

export const getWidgetProps = createStructuredSelector({
  loading: getWidgetLoading,
  error: getWidgetError,
  title: getWidgetTitle,
  sentence: getWidgetSentence,
  data: getWidgetData,
  dataConfig: getWidgetDataConfig,
  settings: getWidgetSettings,
  optionsSelected: getOptionsSelected,
  forestTypes: getForestType,
  landCategory: getLandCategory,
  indicator: getIndicator
});
