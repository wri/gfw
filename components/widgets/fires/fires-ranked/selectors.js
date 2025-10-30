/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import mean from 'lodash/mean';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import { formatNumber } from 'utils/format';

import {
  stdDevData,
  getColorBuckets,
  getColorBucket,
} from 'components/widgets/utils/data';

// get list data
const getData = (state) => state.data && state.data.alerts;
const getAreas = (state) => state.data && state.data.area;
const getLatestDate = (state) => state.data && state.data.latest;
const getUnit = (state) => state.settings && state.settings.unit;
const getOptionsSelected = (state) => state.optionsSelected;
const getIndicator = (state) => state.indicator;
const getAdm1 = (state) => state.adm1;
const getLocation = (state) => state.location || null;
const getLocationsMeta = (state) =>
  state.location === 'global' ? state.locationData : state.childData;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;

const VIIRS_START_YEAR = 2012;

export const getYears = createSelector([getLatestDate], (latest) => {
  const latestYear = moment(latest).year();

  const years = [];
  for (let i = VIIRS_START_YEAR; i <= latestYear; i += 1) {
    years.push(i);
  }
  return years;
});

export const getFilterWeeks = createSelector(
  [getLatestDate, getOptionsSelected],
  (latest, options) => {
    const period = (options.weeks && options.weeks.value) || 4;
    const endWeek = moment(latest).isoWeek();
    const startWeek = moment(latest).subtract(period, 'weeks').isoWeek();
    return { startWeek, endWeek };
  }
);

export const getStatsByAdmin = createSelector(
  [getData, getYears, getAdm1, getLocation, getFilterWeeks],
  (data, years, adm1, location, filterWeeks) => {
    if (isEmpty(data) || isEmpty(years)) {
      return null;
    }
    let matchKey = 'iso';
    if (location.value !== 'global') matchKey = adm1 ? 'adm2' : 'adm1';
    const alertsByAdm = groupBy(data, matchKey);
    const { startWeek, endWeek } = filterWeeks;
    const filteredAlertsByAdmin = Object.entries(alertsByAdm).map(
      ([adm, adminAlerts]) => {
        let countsArray = [];
        if (startWeek < endWeek) {
          countsArray = years.map((year) => {
            const filteredYear = adminAlerts.filter((el) => el.year === year);
            return filteredYear.length > 0 ? sumBy(filteredYear, 'count') : 0;
          });
        } else {
          // i.e. the period goes into previous year
          countsArray = years.map((year) => {
            // in the case that the period goes over the year line we need to filter differently.
            const filteredYear = adminAlerts.filter(
              (el) =>
                (el.year === year && el.week <= endWeek) ||
                (el.year === year - 1 && el.week > startWeek)
            );
            return filteredYear.length > 0 ? sumBy(filteredYear, 'count') : 0;
          });
        }
        const stdDevCounts = stdDevData(countsArray);
        const meanCounts = mean(countsArray);
        const currentYearCounts = countsArray[countsArray.length - 1];
        const significance =
          stdDevCounts > 0
            ? (currentYearCounts - meanCounts) / stdDevCounts
            : 0;
        return { id: adm, significance, currentYearCounts };
      }
    );
    return filteredAlertsByAdmin;
  }
);

export const parseList = createSelector(
  [getStatsByAdmin, getAreas, getLocationsMeta, getLocation, getAdm1],
  (data, areas, meta, location, adm1) => {
    if (isEmpty(data) || isEmpty(areas) || isEmpty(meta)) {
      return null;
    }
    // Now we have partial data, we iterate through and calculate
    // derivateive data: alert density and labels etc
    let matchKey = 'iso';
    if (location.value !== 'global') matchKey = adm1 ? 'adm2' : 'adm1';
    const mappedData = data.map((adm) => {
      const locationId = matchKey === 'iso' ? adm.id : parseInt(adm.id, 10);
      const region = meta[locationId];

      const counts = adm.currentYearCounts;
      const locationAreaData =
        areas.find((el) => el[matchKey] === locationId) || {};

      const locationArea = locationAreaData.area__ha || null;
      // Density in counts per Mha
      const density = locationArea ? (1e6 * counts) / locationArea : 0;
      const { significance } = adm;

      return {
        id: locationId,
        counts,
        density,
        significance,
        area: locationArea,
        label: (region && region.label) || '',
        path: (region && region.path) || '',
      };
    });
    const filteredData = mappedData.filter((d) => d.label);
    return matchKey === 'iso' && location.value !== 'global'
      ? filteredData.filter((d) => d.area > 1e6 && d.density > 1) // At least one fire per MHa at iso level
      : filteredData;
  }
);

export const parseData = createSelector(
  [parseList, getUnit, getColors],
  (data, unit, colors) => {
    if (isEmpty(data)) return null;
    const value = {
      alert_density: 'density',
      counts: 'counts',
      significance: 'significance',
    }[unit];

    const buckets = colors && getColorBuckets(colors);
    const maxValue = maxBy(data, value)[value];
    const minValue = minBy(data, value)[value];
    const rescaledBuckets = buckets.map((b) => ({
      ...b,
      limit:
        value === 'significance'
          ? b.stdDev
          : minValue + (b.limit * (maxValue - minValue)) / 100,
    }));
    const sortedData = sortBy(
      data.map((d) => ({
        ...d,
        value: d[value], // value === 'density' ? d[value] : d.counts,
        color:
          rescaledBuckets && getColorBucket(rescaledBuckets, d[value]).color,
      })),
      value
    ).reverse();
    return sortedData;
  }
);

export const parseSentence = createSelector(
  [
    parseData,
    getUnit,
    getOptionsSelected,
    getIndicator,
    getLocationName,
    getSentences,
    getColors,
  ],
  (data, unit, optionsSelected, indicator, locationName, sentences, colors) => {
    if (!data || !unit || !locationName) return null;

    const {
      initial,
      withInd,
      densityInitial,
      densityWithInd,
      countsInitial,
      countsWithInd,
      initialGlobal,
      withIndGlobal,
      densityInitialGlobal,
      densityWithIndGlobal,
      countsInitialGlobal,
      countsWithIndGlobal,
    } = sentences;
    const topRegion = data[0].label;
    const topRegionCount = data[0].counts || 0;
    const topRegionVariance = data[0].significance || 0;
    const topRegionDensity = data[0].density || 0;
    const topRegionPerc =
      topRegionCount === 0 ? 0 : (100 * topRegionCount) / sumBy(data, 'counts');

    const timeFrame = optionsSelected.weeks;
    const colorRange = colors.ramp;
    let statusColor = colorRange[8];

    let status = 'unusually low';
    if (topRegionVariance > 2) {
      status = 'unusually high';
      statusColor = colorRange[0];
    } else if (topRegionVariance <= 2 && topRegionVariance > 1) {
      status = 'high';
      statusColor = colorRange[2];
    } else if (topRegionVariance <= 1 && topRegionVariance > -1) {
      status = 'normal';
      statusColor = colorRange[4];
    } else if (topRegionVariance <= -1 && topRegionVariance > -2) {
      status = 'low';
      statusColor = colorRange[6];
    }
    const params = {
      timeframe: timeFrame && timeFrame.label,
      status: {
        value: status,
        color: statusColor,
      },
      topRegion,
      topRegionCount: formatNumber({ num: topRegionCount, unit: 'counts' }),
      topRegionPerc: formatNumber({ num: topRegionPerc, unit: '%' }),
      topRegionDensity: `${format('.2r')(topRegionDensity)} fires/Mha`,
      location: locationName === 'global' ? 'globally' : locationName,
      indicator: `${indicator ? `${indicator.label}` : ''}`,
      component:
        unit === 'significance'
          ? {
              key: 'significant',
              fine: false,
              tooltip: `'Significance' is a measure of how much the number of recorded fire alerts in the last ${
                timeFrame && timeFrame.label
              } varies from the expected value when considering the same period over all available historic data. Positive values indicate higher than expected, negative values indicate lower than expected, and values between ±1.0 are considered to be within the 'normal' range.`,
            }
          : {},
    };
    let sentence = indicator ? withInd : initial;
    if (unit === 'alert_density') {
      sentence = indicator ? densityWithInd : densityInitial;
    } else if (unit === 'counts') {
      sentence = indicator ? countsWithInd : countsInitial;
    }
    if (locationName === 'global') {
      sentence = indicator ? withIndGlobal : initialGlobal;
      if (unit === 'alert_density') {
        sentence = indicator ? densityWithIndGlobal : densityInitialGlobal;
      } else if (unit === 'counts') {
        sentence = indicator ? countsWithIndGlobal : countsInitialGlobal;
      }
    }
    return { sentence, params };
  }
);

export const parseConfig = createSelector(
  [getColors, getUnit],
  (colors, unit) => {
    const colorRange = colors.ramp;
    return {
      showStickUnit: unit !== 'alert_density',
      showLegendUnit: unit === 'alert_density',
      ...(unit === 'significance' && {
        legend: {
          uhigh: {
            label: 'Unusually high',
            color: colorRange[0],
          },
          high: {
            label: 'High',
            color: colorRange[2],
          },
          average: {
            label: 'Normal',
            color: colorRange[4],
          },
          low: {
            label: 'Low',
            color: colorRange[6],
          },
          ulow: {
            label: 'Unusually low',
            color: colorRange[8],
          },
        },
      }),
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
});
