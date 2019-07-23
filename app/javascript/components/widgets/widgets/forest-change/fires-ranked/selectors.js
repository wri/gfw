import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import { getColorBuckets, getColorBucket } from 'utils/data';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => (state.data && state.data.alerts) || null;
const getLatestDates = state => (state.data && state.data.latest) || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.allLocation || null;
const getLocationsMeta = state => state.childLocationData || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentences || null;

export const parseList = createSelector(
  [
    getData,
    getLatestDates,
    getSettings,
    getLocation,
    getLocationsMeta,
    getColors
  ],
  (data, latest, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const { payload, query, type } = location;
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
    const groupedAlerts = groupBy(alertsByDate, payload.adm1 ? 'adm2' : 'adm1');

    const totalCounts = sumBy(alertsByDate, 'count');
    const mappedData = Object.keys(groupedAlerts).map(k => {
      const locationId = parseInt(k, 10);
      const region = meta.find(l => locationId === l.value);
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
        label: (region && region.label) || '',
        path: {
          type,
          payload: {
            ...payload,
            ...(payload.adm1 && {
              adm2: locationId
            }),
            ...(!payload.adm1 && {
              adm1: locationId
            })
          },
          query: {
            ...query,
            map: {
              ...(query && query.map),
              canBound: true
            }
          }
        }
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
    getSettings,
    getOptions,
    getIndicator,
    getLocationName,
    getSentences
  ],
  (data, settings, options, indicator, locationName, sentences) => {
    if (!data || !options || !locationName) return '';
    const { initial, withInd } = sentences;
    const topRegion = data[0].label;
    const topRegionCount = data[0].count;
    const topRegionPerc = data[0].value;
    const timeFrame =
      options.weeks && options.weeks.find(w => w.value === settings.weeks);

    const params = {
      timeframe: timeFrame && timeFrame.label,
      topRegion,
      topRegionCount: format(',')(topRegionCount),
      topRegionPerc: `${format('.2r')(topRegionPerc)}%`,
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
