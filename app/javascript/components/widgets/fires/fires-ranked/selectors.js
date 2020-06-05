import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import mean from 'lodash/mean';
import { format } from 'd3-format';
import { getColorBuckets, getColorBucket } from 'utils/data';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import { stdDevData } from 'components/widgets/utils/data';

// get list data
const getData = state => state.data && state.data.alerts;
const getAreas = state => state.data && state.data.area;
const getLatestDate = state => state.data && state.data.latest;
const getUnit = state => state.settings && state.settings.unit;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getAdm1 = state => state.adm1;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

const VIIRS_START_YEAR = 2012;

export const getYears = createSelector([getLatestDate], latest => {
  const latestYear = moment(latest).year();

  const years = [];
  for (let i = VIIRS_START_YEAR; i <= latestYear; i++) {
    years.push(i);
  }
  return years;
});

export const getStatsByAdmin = createSelector(
  [getData, getYears, getAdm1, getLocation],
  (data, years, adm1, location) => {
    if (isEmpty(data) || isEmpty(years)) {
      return null;
    }
    let matchKey = 'iso';
    if (location.value !== 'global') matchKey = adm1 ? 'adm2' : 'adm1';
    const alertsByAdm = groupBy(data, matchKey);

    const filteredAlertsByAdmin = Object.entries(alertsByAdm).map(
      ([adm, adminAlerts]) => {
        const countsArray = years.map(year => {
          const filteredYear = adminAlerts.filter(el => el.year === year);
          return filteredYear.length > 0 ? sumBy(filteredYear, 'count') : 0;
        });

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
    const mappedData = data.map(adm => {
      const locationId = matchKey === 'iso' ? adm.id : parseInt(adm.id, 10);
      const region = meta[locationId];

      const counts = adm.currentYearCounts;
      const locationAreaData = areas.find(el => el[matchKey] === adm.id) || {};

      const locationArea = locationAreaData.area__ha || null;
      // Density in counts per Mha
      const density = locationArea ? 1e6 * counts / locationArea : 0;
      const { significance } = adm;

      return {
        id: locationId,
        counts,
        density,
        significance: 100 * significance,
        area: locationArea,
        label: (region && region.label) || '',
        path: (region && region.path) || ''
      };
    });
    return matchKey === 'iso'
      ? mappedData.filter(d => d.area > 1e6)
      : mappedData;
  }
);

export const parseData = createSelector(
  [parseList, getUnit, getColors],
  (data, unit, colors) => {
    if (isEmpty(data)) return null;
    const value = {
      alert_density: 'density',
      counts: 'counts',
      significance: 'significance'
    }[unit];

    const buckets = colors && getColorBuckets(colors);
    const maxValue = maxBy(data, value)[value];
    const minValue = minBy(data, value)[value];
    const rescaledBuckets = buckets.map(b => ({
      ...b,
      limit:
        value === 'significance'
          ? 100 * b.stdDev
          : minValue + b.limit * (maxValue - minValue) / 100
    }));

    return sortBy(
      data.map(d => ({
        ...d,
        value: d[value], // value === 'density' ? d[value] : d.counts,
        color:
          rescaledBuckets && getColorBucket(rescaledBuckets, d[value]).color
      })),
      value
    ).reverse();
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
    getColors
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
      countsWithIndGlobal
    } = sentences;
    const topRegion = data[0].label;
    const topRegionCount = data[0].counts || 0;
    const topRegionVariance = data[0].significance / 100 || 0;
    const topRegionDensity = data[0].density || 0;
    const topRegionPerc = 100 * topRegionCount / sumBy(data, 'counts');
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
      status = 'average';
      statusColor = colorRange[4];
    } else if (topRegionVariance <= -1 && topRegionVariance > -2) {
      status = 'low';
      statusColor = colorRange[6];
    }

    const params = {
      timeframe: timeFrame && timeFrame.label,
      status: {
        value: status,
        color: statusColor
      },
      topRegion,
      topRegionCount: format(',')(topRegionCount),
      topRegionPerc: `${format('.2r')(topRegionPerc)}%`,
      topRegionDensity: `${format('.3r')(topRegionDensity)} fires/Mha`,
      location: locationName,
      indicator: `${indicator ? `${indicator.label}` : ''}`,
      component: {
        key: 'significant',
        fine: false,
        tooltip: 'Over a given period of time, \'significance\' is a measure of how much the number of recorded fire alerts varies from the expected value given all available historic data. Positiive values indicate higher than expected, whereas negative values indate lower than expected. A value between ±100% may be considered \'average\'.'
      }
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
  sentence: parseSentence,
  title: parseTitle
});
