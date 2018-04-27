import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => state.data.alerts || null;
const getExtent = state => state.data.extent || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.activeIndicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state =>
  (!state.region ? state.regions : state.subRegions) || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentences || null;

export const parseData = createSelector(
  [getData, getExtent, getSettings, getLocation, getLocationsMeta, getColors],
  (data, extent, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const alertsByDate = data.filter(d =>
      moment(new Date(d.date)).isAfter(
        moment.utc().subtract(settings.weeks, 'weeks')
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
      return {
        id: k,
        color: colors.main,
        percentage: countsAreaPerc,
        count: counts,
        area: countsArea,
        value: settings.unit === 'ha' ? countsArea : countsAreaPerc,
        label: (region && region.label) || '',
        path: `/country/${location.country}/${
          location.region ? `${location.region}/` : ''
        }${k}`
      };
    });
    return sortBy(mappedData, 'value').reverse();
  }
);

export const getSentence = createSelector(
  [
    parseData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getLocationNames,
    getSentences
  ],
  (data, settings, options, location, indicator, locationNames, sentences) => {
    if (!data || !options || !indicator || !locationNames) return '';
    const { initial } = sentences;
    const params = {
      timeframe: options.weeks.find(w => w.value === settings.weeks).label,
      count: format(',')(sumBy(data, 'count')),
      area: `${format('.2s')(sumBy(data, 'area'))}ha`,
      location: `${locationNames.current.label}`,
      indicator: `${
        indicator && indicator.value !== 'gadm28'
          ? `${indicator.label} in `
          : ''
      }`
    };
    return { sentence: initial, params };
  }
);
