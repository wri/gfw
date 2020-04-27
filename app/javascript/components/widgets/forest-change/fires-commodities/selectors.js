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
const getAdm1 = state => state.adm1;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const parseList = createSelector(
  [getData,getLatestDates, getSettings, getAdm1, getLocationsMeta, getColors],
  (data, latest, settings, adm1, meta, colors) => {
    if (!data || isEmpty(data)) return null;
    console.log('data',data)
    const alertsData = data.alerts || [];
    const alertsArea = data.area || [];
    if (!alertsData || isEmpty(alertsData) || !alertsArea || isEmpty(alertsArea)) return null;
    
    const latestWeek = moment(latest)
      .subtract(1, 'weeks')
      .week();
    const latestYear = moment(latest)
      .subtract(1, 'weeks')
      .year();
    const alertsByDate = alertsData.filter(d =>
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
    console.log('alertsByDate',alertsByDate)
    const commodityKeys = ['is__gfw_logging', 'is__gfw_mining', 'is__gfw_oil_gas', 'is__gfw_oil_palm', 'is__gfw_wood_fiber']
    
    let reducedData = [];
    alertsData.forEach(d => {
      commodityKeys.forEach(key=> {
        const commodity = d[key] && d[key]==='true' ? key : null;
        if (commodity !== null) {reducedData.push({
          ...d,
          commodity,
        })} 
      })
    })

    const groupedAlerts = groupBy(reducedData,'commodity')
    
    const mappedData = Object.keys(groupedAlerts).map(k => {
      const AlertbyCommodity = groupedAlerts[k]
      const Alertcount = sumBy(AlertbyCommodity,'count')
      const CommodityArea = sumBy(groupBy(alertsArea.data,k)['true'],'area__ha')
      
      const density = CommodityArea && CommodityArea !== 0 ? Alertcount / CommodityArea : null;
      //const locationId = parseInt(k, 10);
      //const region = meta[locationId];
      console.log('density',density)
      //const regionData = groupedAlerts[locationId];


      //const counts = sumBy(regionData, 'count');
      //const countsPerc = counts && totalCounts ? counts / totalCounts * 100 : 0;

      const buckets = colors && getColorBuckets(colors);
      const colorBucket = buckets && getColorBucket(buckets, Alertcount );//countsPerc);

      return {
        id: k,
        color: colorBucket.color,
        density: `${format('.2r')(density)} alerts/Ha`,
        count: density,//counts,
        value: density,//countsPerc,
        label: k//(region && region.label) || ''
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
    //const topRegion = data[0].label;
    //const topRegionCount = data[0].count;
    //const topRegionPerc = data[0].value;
    const timeFrame = optionsSelected.weeks;

    const params = {
      timeframe: timeFrame && timeFrame.label,
      // topRegion,
      // topRegionCount: format(',')(topRegionCount),
      // topRegionPerc: `${format('.2r')(topRegionPerc)}%`,
      location: locationName,
      indicator: `${indicator ? `${indicator.label}` : ''}`
    };
    //console.log('indicator', indicator)
    const sentence = indicator ? withInd : initial;
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
