import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import { getColorBuckets, getColorBucket } from 'utils/data';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => state.data && state.data.alerts;
const getLatestDates = state => state.data && state.data.latest;
const getSettings = state => state.settings;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getAdm1 = state => state.adm1;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const parseList = createSelector(
  [getData, getLatestDates, getSettings, getAdm1, getLocationsMeta, getColors],
  (data, latest, settings, adm1, meta, colors) => {
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
    const groupedAlerts = groupBy(alertsByDate, adm1 ? 'adm2' : 'adm1');
    console.log('DATA', groupedAlerts)

    // before sumBy we need to group by year and calculate stats

    const totalCounts = sumBy(alertsByDate, 'count');
    const mappedData = Object.keys(groupedAlerts).map(k => {
      const locationId = parseInt(k, 10);
      const region = meta[locationId];
      const regionData = groupedAlerts[locationId];
      const counts = sumBy(regionData, 'count');
      const countsPerc = counts && totalCounts ? counts / totalCounts * 100 : 0;

      const buckets = colors && getColorBuckets(colors);
      const colorBucket = buckets && getColorBucket(buckets, countsPerc);

      return {
        id: k,
        color: colorBucket.color,
        percentage: `${format('.2r')(countsPerc)}%`,
        count: counts,
        value: countsPerc,
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
  [parseData, getOptionsSelected, getIndicator, getLocationName, getSentences],
  (data, optionsSelected, indicator, locationName, sentences) => {
    if (!data || !optionsSelected || !locationName) return null;
    const { initial, withInd } = sentences;
    const topRegion = data[0].label;
    const topRegionCount = data[0].count;
    const topRegionPerc = data[0].value;
    const timeFrame = optionsSelected.weeks;

    const params = {
      timeframe: timeFrame && timeFrame.label,
      topRegion,
      topRegionCount: format(',')(topRegionCount),
      topRegionPerc: `${format('.2r')(topRegionPerc)}%`,
      location: locationName,
      indicator: `${indicator ? `${indicator.label}` : ''}`
    };
    const sentence = indicator ? withInd : initial;
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
