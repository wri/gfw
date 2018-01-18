import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { sortByKey } from 'utils/data';

import INDICATORS from 'pages/country/data/indicators.json';
import THRESHOLDS from 'pages/country/data/thresholds.json';
import UNITS from 'pages/country/data/units.json';
import PERIODS from 'pages/country/data/periods.json';
import EXTENT_YEARS from 'pages/country/data/extent-years.json';

// get list data
const getAdmins = state => state.location || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getData = state => state.data || null;
const getStartYear = state => state.startYear || null;
const getEndYear = state => state.endYear || null;
const getConfig = state => state.config || null;
const getLocationWhitelist = state =>
  (state.location.region ? state.regionWhitelist : state.countryWhitelist);

// helper to get active key for location
export const getActiveAdmin = location => {
  if (location.subRegion) return 'subRegion';
  if (location.region) return 'region';
  return 'country';
};

// helper to get active filter from state based on key
export const getActiveFilter = (settings, filters, key) =>
  (filters ? filters.find(i => i.value === settings[key]) : null);

export const getActiveIndicator = indicator =>
  INDICATORS.find(i => i.value === indicator);

export const getLocationLabel = (location, indicator, indicators) => {
  if (!location || !indicators || !indicators.length) return '';
  const activeIndicator = indicators.find(i => i.value === indicator);
  return activeIndicator.value === 'gadm28'
    ? location
    : `${activeIndicator.label} in ${location}`;
};

// get lists selected
export const getAdminsOptions = createSelector(
  [getCountries, getRegions, getSubRegions],
  (countries, regions, subRegions) => ({
    countries: (countries && sortByKey(countries, 'label')) || null,
    regions:
      (regions &&
        [{ label: 'All Regions', value: null }].concat(
          sortByKey(regions, 'label')
        )) ||
      null,
    subRegions:
      (subRegions &&
        [{ label: 'All Regions', value: null }].concat(
          sortByKey(subRegions, 'label')
        )) ||
      null
  })
);

// get lists selected
export const getAdminsSelected = createSelector(
  [getAdminsOptions, getAdmins],
  (options, adminsSelected) => {
    const country =
      (options.countries &&
        options.countries.find(i => i.value === adminsSelected.country)) ||
      null;
    const region =
      (options.regions &&
        options.regions.find(i => {
          if (!adminsSelected.region) return options.regions[0];
          return i.value === adminsSelected.region;
        })) ||
      null;
    const subRegion =
      (options.subRegions &&
        options.subRegions.find(i => {
          if (!adminsSelected.subRegion) return options.subRegions[0];
          return i.value === adminsSelected.subRegion;
        })) ||
      null;
    let current = country;
    if (adminsSelected.subRegion) {
      current = subRegion;
    } else if (adminsSelected.region) {
      current = region;
    }

    return {
      country,
      region,
      subRegion,
      current
    };
  }
);

export const getIndicators = createSelector(
  [getLocationWhitelist, getAdminsSelected, getConfig],
  (locationWhitelist, locationNames, config) => {
    if (
      isEmpty(locationNames) ||
      !locationNames.current ||
      isEmpty(locationWhitelist)
    ) {
      return null;
    }
    const whitelist = Object.keys(locationWhitelist);
    return sortByKey(
      INDICATORS.filter(
        i =>
          config.indicators.indexOf(i.value) > -1 &&
          whitelist.indexOf(i.value) > -1 &&
          (!config.type ||
            config.type === 'extent' ||
            (locationWhitelist[i.value] &&
              locationWhitelist[i.value][config.type]))
      ).map(item => {
        const indicator = item;
        if (indicator.value === 'gadm28') {
          indicator.label = `All of ${locationNames.current.label}`;
        }
        return indicator;
      }),
      'label'
    );
  }
);

export const getThresholds = createSelector([], () =>
  sortByKey(THRESHOLDS, 'value')
);

export const getUnits = createSelector([], () => sortByKey(UNITS, 'label'));

export const getExtentYears = createSelector([], () => EXTENT_YEARS);

export const getYears = createSelector([getData, getConfig], (data, config) => {
  if (isEmpty(data) || !data.length) return null;

  return uniq(data.map(d => d.year))
    .filter(
      d =>
        !config.yearRange ||
        (d >= config.yearRange[0] && d <= config.yearRange[1])
    )
    .map(d => ({
      label: d,
      value: d
    }));
});

export const getStartYears = createSelector(
  [getYears, getEndYear],
  (years, endYear) => {
    if (isEmpty(years) || !endYear) return null;
    return years.filter(y => y.value <= endYear);
  }
);

export const getEndYears = createSelector(
  [getYears, getStartYear],
  (years, startYear) => {
    if (isEmpty(years) || !startYear) return null;
    return years.filter(y => y.value >= startYear);
  }
);

export const getPeriods = createSelector([], () => PERIODS);
