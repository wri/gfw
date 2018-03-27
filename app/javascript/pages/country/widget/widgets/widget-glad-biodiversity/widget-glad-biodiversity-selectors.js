import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

// get list data
const getData = state => state.data || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector(
  [getData, getExtent, getSettings, getLocation, getLocationsMeta, getColors],
  (data, extent, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const alertsByDate = data.filter(d =>
      moment(d.date).isAfter(moment.utc().subtract(settings.weeks, 'weeks'))
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
      const countsAreaPerc =
        countsArea && regionExtent ? countsArea / regionExtent.extent * 100 : 0;
      return {
        id: k,
        color: colors.main,
        percentage: countsAreaPerc,
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
    getSortedData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getLocationNames
  ],
  (data, settings, options, location, indicator, locationNames) => {
    if (!data || !options || !indicator || !locationNames) return '';
    let sentence =
      'In the last <b>{timeframe}</b>, <b>{value}ha</b> of GLAD alerts were detected in <b>{location}</b>, equivalent to a <b>{percentage}%</b> loss relative to <b>{extentYear}</b> tree cover extent.';
    const params = {
      timeframe: options.weeks.find(w => w.value === settings.weeks).label,
      value: format('.2s')(data[0].value),
      location: locationNames.current.label,
      percentage: format('.2f')(data[0].percentage),
      extentYear: settings.extentYear
    };
    Object.keys(params).forEach(p => {
      sentence = sentence.replace(`{${p}}`, params[p]);
    });
    return sentence;
  }
);
