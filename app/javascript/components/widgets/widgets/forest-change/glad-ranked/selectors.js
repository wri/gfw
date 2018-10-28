import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => (state.data && state.data.alerts) || null;
const getLatestDates = state => (state.data && state.data.latest) || null;
const getExtent = state => (state.data && state.data.extent) || null;
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
    getExtent,
    getSettings,
    getLocation,
    getLocationsMeta,
    getColors
  ],
  (data, latest, extent, settings, location, meta, colors) => {
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
    const groupedAlerts = groupBy(
      alertsByDate,
      location.region ? 'adm2' : 'adm1'
    );
    const mappedData = Object.keys(groupedAlerts).map(k => {
      const region = meta.find(l => parseInt(k, 10) === l.value);
      const regionExtent = extent.find(a => a.region === parseInt(k, 10));
      const regionData = groupedAlerts[k];
      const countsArea = sumBy(regionData, 'area_ha');
      const counts = sumBy(regionData, 'count');
      const countsAreaPerc =
        countsArea && regionExtent ? countsArea / regionExtent.extent * 100 : 0;
      const countsPerHa =
        counts && regionExtent ? counts / regionExtent.extent : 0;
      const { payload, query, type } = location;

      return {
        id: k,
        color: colors.main,
        percentage: `${format('.2r')(countsAreaPerc)}%`,
        countsPerHa,
        count: counts,
        area: countsArea,
        value: settings.unit === 'ha' ? countsArea : countsAreaPerc,
        label: (region && region.label) || '',
        path: {
          type,
          payload: {
            ...payload,
            ...(payload.adm1 && {
              adm2: k
            }),
            ...(!payload.adm1 && {
              adm1: k
            })
          },
          query
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
    parseList,
    getSettings,
    getOptions,
    getIndicator,
    getLocationName,
    getSentences
  ],
  (data, sortedList, settings, options, indicator, locationName, sentences) => {
    if (!data || !options || !locationName) return '';
    const { initial, withInd } = sentences;
    const totalCount = sumBy(data, 'count');
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
    const countArea = sumBy(data, 'area');
    const formatType = countArea < 1 ? '.3r' : '.3s';
    const params = {
      timeframe: options.weeks.find(w => w.value === settings.weeks).label,
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
