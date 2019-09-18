import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => state.data && state.data.alerts;
const getLatestDates = state => state.data && state.data.latest;
const getExtent = state => state.data && state.data.extent;
const getSettings = state => state.settings;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getAdm1 = state => state.adm1;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const parseList = createSelector(
  [
    getData,
    getLatestDates,
    getExtent,
    getSettings,
    getAdm1,
    getLocationsMeta,
    getColors
  ],
  (data, latest, extent, settings, adm1, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const latestWeek = moment(latest)
      .subtract(1, 'weeks')
      .week();
    const latestYear = moment(latest)
      .subtract(1, 'weeks')
      .year();
    const alertsByDate = data.filter(d =>
      moment()
        .week(d.week)
        .year(d.year)
        .isAfter(
          moment()
            .week(latestWeek)
            .year(latestYear)
            .subtract(settings.weeks, 'weeks')
        )
    );
    const groupKey = adm1 ? 'adm2' : 'adm1';
    const groupedAlerts = groupBy(alertsByDate, groupKey);
    const totalCounts = sumBy(alertsByDate, 'alerts');
    const mappedData =
      groupedAlerts &&
      Object.keys(groupedAlerts).map(k => {
        const region = meta[k];
        const regionExtent = extent.find(
          a => parseInt(a[groupKey], 10) === parseInt(k, 10)
        );
        const regionData = groupedAlerts[k];
        const countsArea = sumBy(regionData, 'area_ha') || 0;
        const counts = sumBy(regionData, 'alerts') || 0;
        const countsAreaPerc =
          counts && totalCounts ? counts / totalCounts * 100 : 0;
        const countsPerHa =
          counts && regionExtent ? counts / regionExtent.extent : 0;

        return {
          id: k,
          color: colors.main,
          percentage: `${format('.2r')(countsAreaPerc)}%`,
          countsPerHa,
          count: counts,
          area: countsArea,
          value: settings.unit === 'ha' ? countsArea : countsAreaPerc,
          label: (region && region.label) || ''
        };
      });
    return sortBy(mappedData, 'area').reverse();
  }
);

export const parseData = createSelector([parseList], data => {
  if (isEmpty(data)) return null;
  return sortBy(data, 'value').reverse();
});

export const parseSentence = createSelector(
  [
    parseData,
    parseList,
    getOptionsSelected,
    getIndicator,
    getLocationName,
    getSentences
  ],
  (data, sortedList, optionsSelected, indicator, locationName, sentences) => {
    if (!data || !optionsSelected || !locationName) return '';
    const { initial, withInd } = sentences;
    const totalCount = sumBy(data, 'count') || 0;
    let percentileCount = 0;
    let percentileLength = 0;
    while (
      percentileLength < sortedList.length &&
      percentileCount / totalCount < 0.5 &&
      percentileLength !== 10
    ) {
      percentileCount += sortedList[percentileLength].count;
      percentileLength += 1;
    }
    const topCount = percentileCount / totalCount * 100;
    const countArea = sumBy(data, 'area') || 0;
    const formatType = countArea < 1 ? '.3r' : '.3s';
    const timeFrame = optionsSelected.weeks;

    const params = {
      timeframe: timeFrame && timeFrame.label,
      count: format(',')(totalCount),
      area: `${format(formatType)(countArea)}ha`,
      topPercent: `${format('.2r')(topCount)}%`,
      topRegions:
        percentileLength === 1
          ? `${percentileLength} region`
          : `${percentileLength} regions`,
      location: locationName,
      indicator: `${indicator ? `${indicator.label.toLowerCase()}` : ''}`
    };
    const sentence = indicator ? withInd : initial;
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
