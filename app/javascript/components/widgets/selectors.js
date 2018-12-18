import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import lowerCase from 'lodash/lowerCase';

import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';
import allOptions from './options';
import allWidgets from './manifest';

export const selectLocation = state => state.location && state.location.payload;
export const selectAnalysis = (state, { analysis }) => analysis;
export const selectAllLocation = state => state.location;
export const selectLocationType = state =>
  state.location && state.location.payload && state.location.payload.type;
export const selectWidgetFromQuery = state =>
  state.location && state.location.query && state.location.query.widget;
export const selectEmbed = (state, { embed }) => embed;
export const selectGeostore = state => state.geostore && state.geostore.data;
export const selecteNoWidgetsMessage = (state, { noWidgetsMessage }) =>
  noWidgetsMessage;
export const selectWidgets = state => state.widgets && state.widgets.widgets;
export const selectLoading = state =>
  state.countryData &&
  state.whitelists &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.whitelists.countriesLoading ||
    state.whitelists.regionsLoading);
export const selectWhitelists = state =>
  (state.whitelists
    ? {
      adm0: state.whitelists.countries,
      adm1: state.whitelists.regions
    }
    : {});
export const setectCountryData = state =>
  (state.countryData
    ? {
      adm0: state.countryData.countries,
      adm1: state.countryData.regions,
      adm2: state.countryData.subRegions,
      fao: state.countryData.faoCountries
    }
    : {});

const locationTypes = {
  country: {
    label: 'country',
    value: 'admin'
  },
  geostore: {
    label: 'your custom area',
    value: 'geostore'
  },
  wdpa: {
    label: 'your selected protected area',
    value: 'wdpa'
  },
  use: {
    label: 'your selected area',
    value: 'use'
  }
};

export const getOptions = createSelector([], () => {
  const optionsMeta = {};
  Object.keys(allOptions).forEach(oKey => {
    optionsMeta[oKey] =
      oKey === 'weeks' ? allOptions[oKey] : sortBy(allOptions[oKey], 'label');
  });
  return optionsMeta;
});

export const getAdminLevel = createSelector([selectLocation], location => {
  const { type, adm0, adm1, adm2 } = location;
  if (adm2) return 'adm2';
  if (adm1) return 'adm1';
  if (adm0) return 'adm0';
  return type || 'global';
});

export const getActiveWhitelist = createSelector(
  [selectWhitelists, getAdminLevel],
  (whitelists, adminLevel) =>
    whitelists[adminLevel === 'adm0' ? 'adm0' : 'adm1']
);

export const getLocationData = createSelector(
  [selectLocationType, setectCountryData],
  (type, countryData) => {
    if (type === 'country' || type === 'global') return countryData;
    return {};
  }
);

export const getActiveLocationData = createSelector(
  [getLocationData, selectLocation],
  (locationData, location) => {
    if (location.adm2) return locationData.adm2;
    return locationData[location.adm1 ? 'adm1' : 'adm0'];
  }
);

export const getChildLocationData = createSelector(
  [getLocationData, selectLocation],
  (locationData, location) => {
    if (location.adm2) return null;
    if (!location.adm0) return locationData.adm0;
    return locationData[location.adm1 ? 'adm2' : 'adm1'];
  }
);

export const getLocationObject = createSelector(
  [getActiveLocationData, selectLocation],
  (adms, location) => {
    const { type, adm0, adm1, adm2 } = location;
    if (type !== 'country') {
      return locationTypes[type];
    }
    if (!adms) return null;
    return adm0
      ? adms.find(a => a.value === (adm2 || adm1 || adm0))
      : { label: type, value: type };
  }
);

export const getLocationName = createSelector(
  [getLocationObject, selectLocationType],
  (location, type) => (location && location.label) || type
);

export const getFAOLocationData = createSelector(
  [setectCountryData],
  countryData => countryData.faoCountries
);

export const isTropicalLocation = createSelector([selectLocation], location =>
  tropicalIsos.includes(location && location.adm0)
);

export const getNoWidgetsMessage = createSelector(
  [getLocationName, selecteNoWidgetsMessage],
  (locationName, message) =>
    message && locationName && message.replace('{location}', locationName)
);

export const parseWidgets = createSelector(
  [selectWidgetFromQuery, selectEmbed],
  (widgetQuery, embed) => {
    const widgets = Object.values(allWidgets);
    const filteredWidgets = embed
      ? widgets.filter(w => w.config.widget === widgetQuery)
      : widgets;
    return (
      filteredWidgets &&
      filteredWidgets.length &&
      filteredWidgets.map(w => ({
        ...w,
        widget: w.config && w.config.widget,
        colors: colors[w.config && w.config.colors]
      }))
    );
  }
);

export const filterWidgetsByLocation = createSelector(
  [parseWidgets, selectLocationType, getAdminLevel],
  (widgets, type, adminLevel) => {
    if (!widgets || !type) return null;
    return widgets.filter(w => {
      const { types, admins } = w.config || {};
      return (
        types && types.includes(type) && admins && admins.includes(adminLevel)
      );
    });
  }
);

export const filterWidgetsByLocationType = createSelector(
  [filterWidgetsByLocation, selectLocation, getFAOLocationData],
  (widgets, location, faoCountries) => {
    if (!widgets) return null;
    const isFAOCountry =
      faoCountries && faoCountries.find(f => f.value === location.adm0);
    return widgets.filter(w => {
      const { source, types } = w.config || {};
      const isFao = source === 'fao';
      const hasType = types.includes(location.type);
      return hasType && (!isFAOCountry || isFao);
    });
  }
);

export const filterWidgetsByLocationWhitelist = createSelector(
  [filterWidgetsByLocationType, selectLocation],
  (widgets, location) => {
    if (!widgets) return null;
    return widgets.filter(w => {
      const { whitelists } = w.config;
      if (!whitelists) return true;
      const whitelist = whitelists.adm0;
      if (!whitelist) return true;
      return whitelist.includes(location.adm0);
    });
  }
);

export const filterWidgetsByIndicatorWhitelist = createSelector(
  [filterWidgetsByLocationWhitelist, getActiveWhitelist],
  (widgets, indicatorWhitelist) => {
    if (!widgets) return null;
    if (!indicatorWhitelist.length) return widgets;
    return widgets.filter(w => {
      const { indicators } = w.config.whitelists || {};
      if (!indicators) return true;
      const totalIndicators = concat(indicators, indicatorWhitelist).length;
      const reducedIndicators = uniq(concat(indicators, indicatorWhitelist))
        .length;
      return totalIndicators !== reducedIndicators;
    });
  }
);

// once we know which widgets we can render, lets pass them all static props
export const parseWidgetsWithOptions = createSelector(
  [
    filterWidgetsByIndicatorWhitelist,
    getOptions,
    getActiveWhitelist,
    selectLocation
  ],
  (widgets, options, polynameWhitelist, location) => {
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
              // some horrible an inexcusable filters for forest types and land categories
              filteredOptions =
                location.type === 'global'
                  ? filteredOptions.filter(o => o.global)
                  : filteredOptions;
              filteredOptions =
                polynameWhitelist && polynameWhitelist.length
                  ? filteredOptions.filter(o =>
                    polynameWhitelist.includes(o.value)
                  )
                  : filteredOptions;
              filteredOptions = filteredOptions.map(i => ({
                ...i,
                metaKey:
                  i.metaKey === 'primary_forest'
                    ? `${lowerCase(location.adm0)}_${i.metaKey}${
                      location.adm0 === 'IDN' ? 's' : ''
                    }`
                    : i.metaKey
              }));
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

export const getWidgetsProps = createStructuredSelector({
  loading: selectLoading,
  whitelists: selectWhitelists,
  whitelist: getActiveWhitelist,
  allLocation: selectAllLocation,
  location: selectLocation,
  locationType: selectLocationType,
  locationData: getActiveLocationData,
  locationObject: getLocationObject,
  locationName: getLocationName,
  childLocationData: getChildLocationData,
  noWidgetsMessage: getNoWidgetsMessage,
  isTropical: isTropicalLocation
});
