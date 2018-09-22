import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { pluralise } from 'utils/strings';

import colors from 'data/colors.json';
import allOptions from './options';
import allWidgets from './manifest';

export const selectLocation = state => state.location && state.location.payload;
export const selectQuery = state => state.location && state.location.query;
export const selectGeostore = state => state.geostore.geostore;
export const selectWidgetsFilter = (state, ownProps) => ownProps.widgets;
export const selectWidgets = state => state.widgetsV2.widgets;
export const selectLoading = state =>
  state.countryData.countriesLoading ||
  state.countryData.regionsLoading ||
  state.countryData.subRegionsLoading ||
  state.whitelists.countriesLoading ||
  state.whitelists.regionsLoading;
export const selectWhitelists = state => ({
  countries: state.whitelists.countries,
  regions: state.whitelists.regions
});
export const setectCountryData = state => ({
  countries: state.countryData.countries,
  regions: state.countryData.regions,
  subRegions: state.countryData.subRegions
});

export const getOptions = () => {
  const optionsMeta = {};
  Object.keys(allOptions).forEach(oKey => {
    optionsMeta[oKey] =
      oKey === 'weeks' ? allOptions[oKey] : sortBy(allOptions[oKey], 'label');
  });
  return optionsMeta;
};

export const getActiveWhitelist = createSelector(
  [selectWhitelists, selectLocation],
  (whitelists, location) => whitelists[location.adm1 ? 'regions' : 'countries']
);

export const getActiveLocationData = createSelector(
  [setectCountryData, selectLocation],
  (countryData, location) => {
    if (location.adm2) return countryData.subRegions;
    return countryData[location.adm1 ? 'regions' : 'countries'];
  }
);

export const getChildLocationData = createSelector(
  [setectCountryData, selectLocation],
  (countryData, location) => {
    if (location.adm2) return null;
    return countryData[location.adm1 ? 'subRegions' : 'regions'];
  }
);

export const getActiveWidget = createSelector(
  [selectQuery],
  query => query && query.widget
);

export const getCategory = createSelector(
  [selectQuery],
  query => query && query.category
);

export const getAllWidgets = () => Object.values(allWidgets);

export const parseWidgets = createSelector([getAllWidgets], widgets => {
  if (!widgets) return null;

  return widgets.map(w => ({
    widget: w.initialState.config.widget,
    Component: w.Component,
    getData: w.getData,
    getProps: w.getProps,
    config: w.initialState.config,
    settings: w.initialState.settings,
    colors: colors[w.initialState.config.type]
  }));
});

export const filterWidgetFromProps = createSelector(
  [parseWidgets, selectWidgetsFilter],
  (widgets, filter) => {
    if (!filter) return widgets;
    return widgets.filter(w => filter.includes(w.config.slug));
  }
);

// once we know which widgets we can render, lets pass them all static props
export const parseWidgetsWithOptions = createSelector(
  [filterWidgetFromProps, getOptions, getActiveWhitelist],
  (widgets, options, polynameWhitelist) => {
    if (!widgets) return null;
    return widgets.map(w => {
      const optionsConfig = w.config.options;
      const optionKeys = optionsConfig && Object.keys(optionsConfig);
      return {
        ...w,
        ...(optionsConfig && {
          options: optionKeys.reduce((obj, optionKey) => {
            const polynamesOptions = ['forestTypes', 'landCategories'];
            const configWhitelist = optionsConfig[optionKey];
            let filteredOptions = options[optionKey];
            if (Array.isArray(configWhitelist)) {
              filteredOptions = filteredOptions
                ? filteredOptions.filter(o => configWhitelist.includes(o.value))
                : optionsConfig[optionKey].map(o => ({
                  label: o,
                  value: o
                }));
            }
            if (polynamesOptions.includes(optionKey)) {
              filteredOptions = filteredOptions.filter(o =>
                polynameWhitelist.includes(o.value)
              );
            }
            return {
              ...obj,
              [optionKey]: filteredOptions
            };
          }, {})
        })
      };
    });
  }
);

// now lets pass them their data and settings
export const parseWidgetsWithData = createSelector(
  [parseWidgetsWithOptions, selectWidgets, selectQuery],
  (widgets, widgetsState, query) => {
    if (!widgets) return null;
    return widgets.map(w => {
      const widgetUrlState = (query && query[w.widget]) || {};
      const widgetState = (widgetsState && widgetsState[w.widget]) || {};
      const { options, config } = w;
      const settings = {
        ...w.settings,
        ...widgetUrlState
      };
      console.log(widgetsState);
      return {
        ...w,
        loading: widgetState.loading || false,
        error: widgetState.error || false,
        ...w.getProps({
          ...w,
          settings,
          data: widgetState.data
        }),
        ...(settings && {
          settings
        }),
        ...(options && {
          optionsSelected: Object.keys(config.options).reduce(
            (obj, optionKey) => ({
              ...obj,
              [optionKey]:
                options[pluralise(optionKey)] &&
                options[pluralise(optionKey)].find(
                  o => o.value === settings[optionKey]
                )
            }),
            {}
          )
        }),
        ...(config.options.startYear &&
          config.options.endYear && {
            startYears: options.years.filter(y => y.value <= settings.endYear),
            endYears: options.years.filter(y => y.value >= settings.startYear)
          })
      };
    });
  }
);

export const getWidgetsProps = createStructuredSelector({
  loading: selectLoading,
  whitelists: selectWhitelists,
  activeWhitelist: getActiveWhitelist,
  colors: () => colors,
  activeWidget: getActiveWidget,
  category: getCategory,
  location: selectLocation,
  locationData: getActiveLocationData,
  childLocationData: getChildLocationData,
  widgets: parseWidgetsWithData
});
