import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import lowerCase from 'lodash/lowerCase';

import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';
import { locationLevelToStr } from 'utils/format';
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
    state.whitelists.loading);
export const selectWhitelists = state =>
  state.whitelists && state.whitelists.data;
export const selectCountryData = state =>
  (state.countryData
    ? {
      adm0: state.countryData.countries,
      adm1: state.countryData.regions,
      adm2: state.countryData.subRegions,
      fao: state.countryData.faoCountries
    }
    : {});

export const getLocation = createSelector(
  [selectLocation, selectGeostore],
  (location, geostore) => {
    if (location.type !== 'aoi' || !geostore) return location;

    return {
      ...location,
      type: 'geostore',
      adm0: geostore.id
    };
  }
);

export const getLocationType = createSelector(
  [getLocation],
  location => location.type
);

const locationTypes = {
  country: {
    label: 'country',
    value: 'admin'
  },
  global: {
    label: 'global',
    value: 'global'
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

export const getAdminLevel = createSelector([getLocation], location =>
  locationLevelToStr(location)
);

export const getLocationData = createSelector(
  [getLocationType, selectCountryData],
  (type, countryData) => {
    if (type === 'country' || type === 'global') return countryData;
    return {};
  }
);

export const getActiveLocationData = createSelector(
  [getLocationData, getLocation],
  (locationData, location) => {
    if (location.adm2) return locationData.adm2;
    return locationData[location.adm1 ? 'adm1' : 'adm0'];
  }
);

export const getChildLocationData = createSelector(
  [getLocationData, getLocation],
  (locationData, location) => {
    if (location.adm2) return null;
    if (!location.adm0) return locationData.adm0;
    return locationData[location.adm1 ? 'adm2' : 'adm1'];
  }
);

export const getParentLocationData = createSelector(
  [getLocationData, getLocation],
  (locationData, location) => {
    if (!location.adm1 && !location.adm2) return null;
    return locationData[location.adm2 ? 'adm1' : 'adm0'];
  }
);

export const getLocationDict = createSelector(
  [getLocationData, getLocation],
  (locationData, location) => {
    let values;
    if (location.adm2) values = locationData.adm2;
    else if (location.adm1) values = locationData.adm1;
    else values = locationData.adm0;

    return (
      values &&
      values.length &&
      values.reduce(
        (dict, next) => ({
          ...dict,
          [next.value]: next.label
        }),
        {}
      )
    );
  }
);

export const getLocationObject = createSelector(
  [getAdminLevel, getActiveLocationData, getLocation, getParentLocationData],
  (adminLevel, adms, location, parent) => {
    if (location.type !== 'country') {
      return locationTypes[location.type];
    }

    const locationObject =
      location.adm0 && adms
        ? adms.find(a => a.value === location[adminLevel])
        : { label: location.type, value: location.type };
    let parentObject = {};

    if (adminLevel === 'adm0') {
      parentObject = { label: 'global', value: 'global' };
    } else if (adminLevel === 'adm1') {
      parentObject = (parent &&
        parent.find(a => a.value === location.adm0)) || {
        label: location.type,
        value: location.type
      };
    } else if (adminLevel === 'adm2') {
      parentObject = (parent &&
        parent.find(a => a.value === location.adm1)) || {
        label: location.type,
        value: location.type
      };
    }

    const returnObject = {
      parentLabel: parentObject.label,
      parentValue: parentObject.value,
      ...locationObject,
      adminLevel
    };

    return returnObject;
  }
);

export const getLocationName = createSelector(
  [getLocationObject, getLocationType],
  (location, type) => (location && location.label) || type
);

export const getFAOLocationData = createSelector(
  [selectCountryData],
  countryData => countryData.faoCountries
);

export const isTropicalLocation = createSelector([getLocation], location =>
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
  [parseWidgets, getLocationType, getAdminLevel],
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
  [filterWidgetsByLocation, getLocation, getFAOLocationData],
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
  [filterWidgetsByLocationType, getLocation],
  (widgets, location) => {
    if (!widgets) return null;
    return widgets.filter(w => {
      const { whitelists, blacklists } = w.config;
      if (!whitelists && !blacklists) return true;
      const whitelist = whitelists.adm0;
      const blacklist = blacklists && blacklists.adm1;
      if (!whitelist) return true;
      if (blacklist) {
        if (blacklist.includes(location.adm1)) return false;
      }
      return whitelist.includes(location.adm0);
    });
  }
);

export const filterWidgetsByIndicatorWhitelist = createSelector(
  [filterWidgetsByLocationWhitelist, selectWhitelists],
  (widgets, indicatorWhitelist) => {
    if (!widgets) return null;

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
    selectWhitelists,
    getLocation
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
              // USLC widget exception: reversing options without using Arr.reverse()
              if (configWhitelist.includes('changes_only')) {
                filteredOptions = filteredOptions.reduce(
                  (acc, num) => [num, ...acc],
                  []
                );
              }
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
  whitelist: selectWhitelists,
  allLocation: selectAllLocation,
  location: getLocation,
  locationType: getLocationType,
  locationData: getActiveLocationData,
  locationObject: getLocationObject,
  locationName: getLocationName,
  locationDict: getLocationDict,
  childLocationData: getChildLocationData,
  noWidgetsMessage: getNoWidgetsMessage,
  isTropical: isTropicalLocation
});
