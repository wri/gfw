import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.activeIndicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state =>
  (state.countryData &&
    state.countryData[!location.region ? 'regions' : 'subRegions']) ||
  null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.regions.forEach(d => {
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
    const { initial, hasPercentage, hasIndicator } = sentences;
    const locationLabel =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data.length && data[0];
    const totalExtent = sumBy(data, 'extent');
    const avgExtent = sumBy(data, 'extent') / data.length;
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    while (
      (percentileLength < data.length &&
        percentileExtent / totalExtent < 0.5) ||
      (percentileLength < 10 && data.length > 10)
    ) {
      percentileExtent += data[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / totalExtent * 100;

    const params = {
      location: locationLabel,
      region: topRegion.label,
      indicator: indicator.label,
      percentage: `${format('.0f')(topExtent)}%`,
      relPercentage: `${format('.0f')(topRegion.percentage)}%`,
      averagePerc: `${format('.0f')(avgExtentPercentage)}%`,
      extent: `${format('.3s')(topRegion.extent)}ha`,
      averageExtent: `${format('.3s')(avgExtent)}ha`,
      count: percentileLength
    };

    let sentence = settings.unit === '%' ? hasPercentage : initial;
    if (indicator.value !== 'gadm28') {
      sentence = hasIndicator;
    }

    return {
      sentence,
      params
    };
  }
);
