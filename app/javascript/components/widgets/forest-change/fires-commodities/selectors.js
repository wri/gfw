import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import { getColorBuckets, getColorBucket } from 'utils/data';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => state.data && state.data;
const getLatestDates = state => state.data && state.data.latest;
const getSettings = state => state.settings;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const parseList = createSelector(
  [getData, getLatestDates, getSettings, getColors],
  (data, latest, settings, colors) => {
    if (!data || isEmpty(data)) return null;
    const alertsData = data.alerts || [];
    const alertsArea = data.area || [];
    if (
      !alertsData ||
      isEmpty(alertsData) ||
      !alertsArea ||
      isEmpty(alertsArea)
    ) {
      return null;
    }

    // const latestWeek = moment(latest)
    //   .subtract(1, 'weeks')
    //   .week();
    // const latestYear = moment(latest)
    //   .subtract(1, 'weeks')
    //   .year();
    // const alertsByDate = alertsData.filter(d =>
    //   moment()
    //     .week(d.week)
    //     .year(d.year)
    //     .isAfter(
    //       moment()
    //         .week(latestWeek)
    //         .year(latestYear)
    //         .subtract(settings.weeks, 'weeks')
    //     )
    // );
    const commodityKeys = [
      'is__gfw_logging',
      'is__gfw_mining',
      'is__gfw_oil_gas',
      'is__gfw_oil_palm',
      'is__gfw_wood_fiber'
    ];
    const commoditylabel = {
      is__gfw_logging: 'logging',
      is__gfw_mining: 'mining',
      is__gfw_oil_gas: 'oil gas',
      is__gfw_oil_palm: 'oil palm',
      is__gfw_wood_fiber: 'wood fiber'
    };

    const reducedData = [];
    alertsData.forEach(d => {
      commodityKeys.forEach(key => {
        const commodity = d[key] && d[key] === 'true' ? key : null;
        if (commodity !== null) {
          reducedData.push({
            ...d,
            commodity
          });
        }
      });
    });

    const groupedAlerts = groupBy(reducedData, 'commodity');

    const mappedData = Object.keys(groupedAlerts).map(k => {
      const AlertbyCommodity = groupedAlerts[k];
      const Alertcount = sumBy(AlertbyCommodity, 'count');
      const CommodityArea =
        alertsArea.data && alertsArea.data !== 0
          ? sumBy(groupBy(alertsArea.data, k).true, 'area__ha')
          : null;

      const density =
        CommodityArea && CommodityArea !== 0 ? Alertcount / CommodityArea : '';

      const buckets = colors && getColorBuckets(colors);
      const colorBucket = buckets && getColorBucket(buckets, Alertcount);

      return {
        id: k,
        color: colorBucket.color,
        density: `${format('.2r')(density)} alerts/Ha`,
        // count: density, // counts,
        value: density || '', // density, // countsPerc,
        label: density && k ? commoditylabel[k] : '' // (region && region.label) || ''
      };
    });
    return sortBy(mappedData, 'value').reverse();
  }
);
export const parseData = createSelector([parseList], data => {
  if (isEmpty(data)) return null;
  return sortBy(data, 'value').reverse();
});

export const parseSentence = createSelector(
  [parseData, getOptionsSelected, getIndicator,getLocationName, getSentences],
  (data, optionsSelected, indicator, locationName, sentences) => {
    if (!data || !optionsSelected || !locationName) return null;
    const { initial,withInd } = sentences;
    const density_val = data[0].value;
    const highest_com = data[0].label;
    const timeFrame = optionsSelected.weeks;
    const params = {
      timeframe: timeFrame && timeFrame.label,
      density_val: `${format('.2r')(density_val)} alerts/Ha`,
      highest_com,
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
