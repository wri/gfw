import { createSelector, createStructuredSelector } from 'reselect';
import { pluralise } from 'utils/strings';
import { flattenObj } from 'utils/data';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import range from 'lodash/range';

import landCategories from 'data/land-categories.json';
import forestTypes from 'data/forest-types.json';

export const selectAllPropsAndState = (state, ownProps) => ownProps;
export const selectWidgetSettings = (state, { settings }) => settings;
export const selectWidgetConfig = (state, { config }) => config;
export const selectWidgetOptions = (state, { options }) => options;
export const selectWidgetUrlState = (state, { widget }) =>
  state.location && state.location.query && state.location.query[widget];
export const selectWidgetFromState = (state, { widget }) =>
  state.widgets && state.widgets.widgets[widget];
export const selectWidgetActive = (state, { activeWidget, widget }) =>
  activeWidget === widget;
export const selectWidgetActiveData = (state, { widget }) =>
  state.widgets && state.widgets.settings[widget];

export const getWidgetStateData = createSelector(
  [selectWidgetFromState],
  state => state && state.data
);

export const getWidgetSettings = createSelector(
  [selectWidgetUrlState, selectWidgetSettings, selectWidgetActiveData],
  (urlState, settings, activeData) => ({
    ...settings,
    ...urlState,
    activeData: {
      ...activeData
    }
  })
);

export const getWidgetOptionsFromData = createSelector(
  [selectWidgetFromState, selectAllPropsAndState, getWidgetSettings],
  (widgetState, widgetProps) =>
    widgetProps.getDataOptions && {
      ...widgetProps.getDataOptions({
        ...widgetState
      })
    }
);

export const getWidgetOptions = createSelector(
  [selectWidgetOptions, getWidgetOptionsFromData, getWidgetSettings],
  (options, dataOptions, settings) => {
    const { forestTypes: fTypes } = options || {};

    return {
      ...options,
      ...dataOptions,
      ...(fTypes &&
        fTypes.length &&
        fTypes.find(f => f.value === 'ifl') && {
        forestTypes: fTypes.map(f => ({
          ...f,
          label: f.label.includes('{iflYear}')
            ? f.label.replace('{iflYear}', settings.ifl)
            : f.label
        }))
      })
    };
  }
);

export const getWidgetError = createSelector(
  [selectWidgetFromState],
  props => props && props.error
);

export const getWidgetLoading = createSelector(
  [selectWidgetFromState],
  props => props && props.loading
);

export const getRangeYears = createSelector(
  [getWidgetStateData, selectWidgetConfig],
  (data, config) => {
    const { startYears, endYears, yearsRange } = config.options || {};
    if (!startYears || !endYears || isEmpty(data)) return null;
    let years =
      data.years ||
      (yearsRange && range(yearsRange[0], yearsRange[1] + 1)) ||
      [];
    if (!years.length) {
      const flatData = flattenObj(data);
      Object.keys(flatData).forEach(key => {
        if (key.includes('year')) {
          years = years.concat(flatData[key]);
        }
      });
      years = uniq(years);
      years = yearsRange
        ? years.filter(y => y >= yearsRange[0] && y <= yearsRange[1])
        : years;
    }

    return sortBy(
      years.map(y => ({
        label: y,
        value: y
      })),
      'value'
    );
  }
);

export const getOptionsWithYears = createSelector(
  [getWidgetOptions, getRangeYears, getWidgetSettings],
  (options, years, settings) => {
    if (!years || !years.length) return options;
    const { startYear, endYear } = settings;
    return {
      ...options,
      startYears: years.filter(y => y.value <= endYear),
      endYears: years.filter(y => y.value >= startYear)
    };
  }
);

export const getOptionsSelected = createSelector(
  [getWidgetSettings, getOptionsWithYears],
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

export const getPolynames = createSelector(
  [getForestType, getLandCategory],
  (forestType, landCategory) => {
    if (!forestType && !landCategory) return null;
    return [
      ...((forestType &&
        forestTypes.filter(f => f.value === forestType.value && !f.hidden)) ||
        []),
      ...((landCategory &&
        landCategories.filter(
          l => l.value === landCategory.value && !l.hidden
        )) ||
        [])
    ];
  }
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

export const getWidgetPropsFromState = createSelector(
  [
    selectWidgetFromState,
    selectAllPropsAndState,
    getWidgetSettings,
    getOptionsSelected,
    getOptionsWithYears,
    getForestType,
    getLandCategory,
    getIndicator
  ],
  (
    widgetState,
    widgetProps,
    settings,
    optionsSelected,
    options,
    forestType,
    landCategory,
    indicator
  ) => ({
    ...widgetProps.getProps({
      ...widgetState,
      ...widgetProps,
      options,
      optionsSelected,
      settings,
      forestType,
      landCategory,
      indicator
    })
  })
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

export const getWidgetProps = () =>
  createStructuredSelector({
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
    polynames: getPolynames,
    indicator: getIndicator,
    options: getOptionsWithYears,
    active: selectWidgetActive
  });
