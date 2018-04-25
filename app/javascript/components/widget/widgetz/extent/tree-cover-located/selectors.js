import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import endsWith from 'lodash/endsWith';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const parseData = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: `/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`,
          color: colors.main
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
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
    if (!data || !options || !indicator || !locationNames) return null;
    const {
      initial,
      hasPercentage
    } = sentences;
    const locationLabel =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data.length && data[0];
    
    const params = {
      location: locationLabel,
      region: topRegion.label,
      indicator: indicator.label,
      percentage: topRegion.percentage,
      value: ,
      average: 
      averagePerc: sumBy(data, 'percentage') / data.length
    };
    const sentence = settings.unit === '%' ? hasPercentage : initial;
    return {
      sentence,
      params
    };
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
    const { unit } = settings;

    let sentence = '';
    const topRegion = data.length && data[0];
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    if (unit === '%') {
      sentence = `<b>${
        topRegion.label
      }</b> had the largest relative tree cover of <b>${format('.0f')(
        topRegion.percentage
      )}%</b>, compared to a regional average of <b>${format('.0f')(
        avgExtentPercentage
      )}%</b>.`;
    } else {
      const totalExtent = sumBy(data, 'extent');
      const currentLocation =
        locationNames && locationNames.current && locationNames.current.label;
      const avgExtent = sumBy(data, 'extent') / data.length;
      let percentileExtent = 0;
      let percentileLength = 0;

      if (indicator.value !== 'gadm28') {
        sentence += `For <b>${indicator.label}</b> in <b>${
          currentLocation
        }</b>, `;
      } else {
        sentence += `In <b>${currentLocation}</b>, `;
      }
      while (
        (percentileLength < data.length &&
          percentileExtent / totalExtent < 0.5) ||
        (percentileLength < 10 && data.length > 10)
      ) {
        percentileExtent += data[percentileLength].extent;
        percentileLength += 1;
      }
      const topExtent = percentileExtent / totalExtent * 100;

      if (percentileLength > 1) {
        sentence += `the top <b>${percentileLength}</b> regions represent <b>`;
      } else {
        sentence += `<b>${topRegion.label}</b> represents <b>`;
      }
      if (!location.region) {
        sentence += `${format('.0f')(topExtent)}%`;
      } else {
        sentence += `${format('.0f')(topExtent)}%`;
      }
      sentence += '</b> of all tree cover. ';
      sentence += `${
        percentileLength > 1 ? `<b>${topRegion.label}</b>` : 'This region'
      } has the largest tree cover at `;
      if (topRegion.percentage > 1 && settings.unit === '%') {
        sentence += `<b>${format('.0f')(
          topRegion.percentage
        )}%</b> compared to an average of <b>${format('.0f')(
          avgExtentPercentage
        )}%</b>.`;
      } else {
        sentence += `<b>${format('.3s')(
          topRegion.extent
        )}ha</b> compared to an average of <b>${format('.3s')(
          avgExtent
        )}ha</b>.`;
      }
    }

    return sentence;
  }
);
