import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { sortByKey } from 'utils/data';

import INDICATORS from 'pages/country/data/indicators.json';
import THRESHOLDS from 'pages/country/data/thresholds.json';
import UNITS from 'pages/country/data/units.json';
import DATA_SOURCES from 'pages/country/data/data-sources.json';

// get list data
const getAdmins = state => state.location || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getWhitelist = state => state.whitelist || null;
const getData = state => state.data || null;
const getStartYear = state => state.startYear || null;
const getEndYear = state => state.endYear || null;

// helper to get active key for location
export const getActiveAdmin = location => {
  if (location.subRegion) return 'subRegion';
  if (location.region) return 'region';
  return 'country';
};

// helper to get active filter from state based on key
export const getActiveFilter = (settings, filters, key) =>
  filters.find(i => i.value === settings[key]);

// get lists selected
export const getAdminsOptions = createSelector(
  [getCountries, getRegions, getSubRegions],
  (countries, regions, subRegions) => ({
    countries: (countries && sortByKey(countries, 'value')) || null,
    regions:
      (regions &&
        [{ label: 'All Regions', value: null }].concat(
          sortByKey(regions, 'value')
        )) ||
      null,
    subRegions:
      (subRegions &&
        [{ label: 'All Juristictions', value: null }].concat(
          sortByKey(subRegions, 'value')
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
  [getWhitelist, getAdminsSelected],
  (whitelist, locationNames) => {
    if (isEmpty(locationNames) || !locationNames.current) return null;
    if (!whitelist) return INDICATORS;
    return INDICATORS.filter(i => whitelist.indexOf(i.value) > -1).map(item => {
      const indicator = item;
      if (indicator.value === 'gadm28') {
        indicator.label = `All of ${locationNames.current.label}`;
      }
      return indicator;
    });
  }
);

export const getThresholds = createSelector([], () => THRESHOLDS);

export const getUnits = createSelector([], () => UNITS);

export const getDataSources = createSelector([], () => DATA_SOURCES);

export const getYears = createSelector([getData], data => {
  if (isEmpty(data) || !data.length) return null;
  return uniq(data.map(d => d.year)).map(d => ({
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
