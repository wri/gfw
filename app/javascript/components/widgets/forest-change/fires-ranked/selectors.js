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
const getLatestDates = state => state.data && state.data.latest;
const getSettings = state => state.settings;
const getUnit = state => state.settings && state.settings.unit;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getAdm1 = state => state.adm1;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const getYears = createSelector(
  [getData, getAreas, getLatestDates, getLocationsMeta],
  (data, areas, latest, meta) => {
    if (isEmpty(data) || isEmpty(areas) || isEmpty(meta)) {
      return null;
    }

    const latestYear = moment(latest)
      .subtract(1, 'weeks')
      .year();

    const groupedByYear = groupBy(sortBy(data, ['year', 'week']), 'year');
    const hasAlertsByYears = Object.values(groupedByYear).reduce(
      (acc, next) => {
        const { year } = next[0];
        return {
          ...acc,
          [year]: next.some(item => item.count > 0)
        };
      },
      {}
    );

    const dataYears = Object.keys(hasAlertsByYears).filter(
      key => hasAlertsByYears[key] === true
    );

    const minYear = Math.min(...dataYears.map(el => parseInt(el, 10)));
    const startYear = minYear === latestYear ? latestYear - 1 : minYear;

    const years = [];
    for (let i = startYear; i <= latestYear; i += 1) {
      years.push(i);
    }
    return years;
  }
);

export const getFilteredData = createSelector(
  [getData, getSettings, getLatestDates, getYears],
  (data, settings, latest, years) => {
    if (isEmpty(data) || isEmpty(years)) {
      return null;
    }

    const latestWeek = moment(latest)
      .subtract(1, 'weeks')
      .week();

    return years.reduce((acc, y) => {
      const yearlyAlert = data.filter(d => {
        const date = moment()
          .week(d.week)
          .year(d.year);
        return (
          date.isBefore(
            moment()
              .week(latestWeek + 1)
              .year(y)
          ) &&
          date.isAfter(
            moment()
              .week(latestWeek)
              .year(y)
              .subtract(settings.weeks, 'weeks')
          )
        );
      });
      return [...acc, ...yearlyAlert];
    }, []);
  }
);

export const getStatsByAdmin = createSelector(
  [getFilteredData, getYears, getAdm1],
  (data, years, adm1) => {
    if (isEmpty(data) || isEmpty(years)) {
      return null;
    }

    const matchKey = adm1 ? 'adm2' : 'adm1';
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
        const variance =
          stdDevCounts > 0
            ? (currentYearCounts - meanCounts) / stdDevCounts
            : 0;
        return { id: adm, variance, currentYearCounts };
      }
    );

    return filteredAlertsByAdmin;
  }
);

export const parseList = createSelector(
  [getStatsByAdmin, getAreas, getLocationsMeta, getAdm1],
  (data, areas, meta, adm1) => {
    if (isEmpty(data) || isEmpty(areas) || isEmpty(meta)) {
      return null;
    }

    // Now we have partial data, we iterate through and calculate
    // derivateive data: alert density and labels etc
    const matchKey = adm1 ? 'adm2' : 'adm1';

    const mappedData = data.map(adm => {
      const locationId = parseInt(adm.id, 10);
      const region = meta[locationId];

      const counts = adm.currentYearCounts;
      const locationArea =
        areas.find(el => el[matchKey] === adm.id).area__ha || null;
      const density = locationArea ? 1e6 * counts / locationArea : 0;
      const { variance } = adm;

      return {
        id: locationId,
        counts,
        // counts per Mha
        density,
        variance,
        label: (region && region.label) || ''
      };
    });
    return mappedData;
  }
);

export const parseData = createSelector(
  [parseList, getUnit, getColors],
  (data, unit, colors) => {
    if (isEmpty(data)) return null;

    const value = {
      alert_density: 'density',
      anomaly: 'variance',
      counts: 'counts'
    }[unit];

    const buckets = colors && getColorBuckets(colors);
    const maxValue = maxBy(data, value)[value];
    const minValue = minBy(data, value)[value];
    const rescaledBuckets = buckets.map(b => ({
      ...b,
      limit:
        value === 'variance'
          ? b.stdDev
          : minValue + b.limit * (maxValue - minValue) / 100
    }));

    return sortBy(
      data.map(d => ({
        ...d,
        value: value === 'density' ? d[value] : d.counts,
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
      countsWithInd
    } = sentences;
    const topRegion = data[0].label;
    const topRegionCount = data[0].counts || 0;
    const topRegionVariance = data[0].variance || 0;
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
      topRegionDensity: `${format('.3r')(topRegionDensity)} fires per Mha`,
      location: locationName,
      indicator: `${indicator ? `${indicator.label}` : ''}`
    };
    let sentence = indicator ? withInd : initial;
    if (unit === 'alert_density') {
      sentence = indicator ? densityWithInd : densityInitial;
    } else if (unit === 'counts') {
      sentence = indicator ? countsWithInd : countsInitial;
    }
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
