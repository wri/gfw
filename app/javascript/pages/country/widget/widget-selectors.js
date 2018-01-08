import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { sortByKey } from 'utils/data';

import INDICATORS from 'pages/country/data/indicators.json';
import THRESHOLDS from 'pages/country/data/thresholds.json';
import UNITS from 'pages/country/data/units.json';
import PERIODS from 'pages/country/data/periods.json';

// get list data
const getAdmins = state => state.location || null;
const getCountries = state => state.countries || null;
const getRegions = state => state.regions || null;
const getSubRegions = state => state.subRegions || null;
const getWidgetWhitelist = state => state.widgetWhitelist || null;
const getLocationWhitelist = state => state.locationWhitelist || null;
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
  [getWidgetWhitelist, getLocationWhitelist, getAdminsSelected],
  (widgetWhitelist, locationWhitelist, locationNames) => {
    if (isEmpty(locationNames) || !locationNames.current) return null;
    if (!widgetWhitelist || !locationWhitelist) return INDICATORS;
    return sortByKey(
      INDICATORS.filter(
        i =>
          (widgetWhitelist.indexOf(i.value) > -1 &&
            locationWhitelist.indexOf(i.value) > -1) ||
          i.value === 'gadm28'
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

export const getPeriods = createSelector([], () => PERIODS);
