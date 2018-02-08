import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey, getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getGain = state => state.gain || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector(
  [getGain, getExtent, getSettings, getLocation, getLocationsMeta, getColors],
  (data, extent, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        const locationExtent = extent.filter(l => l.id === d.id);
        const percentage = d.gain / locationExtent[0].extent * 100;
        dataMapped.push({
          label: (region && region.label) || '',
          gain: d.gain,
          percentage,
          value: settings.unit === 'ha' ? d.gain : percentage,
          path: `/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`
        });
      }
    });
    const sortedData = sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
    const colorRange = getColorPalette(
      colors.ramp,
      sortedData.length < 10 ? sortedData.length : 10
    );
    return sortedData.map((o, i) => ({
      ...o,
      color: o.gain ? colorRange[i] || colorRange[9] : colors.noGain
    }));
  }
);

export const getChartData = createSelector([getSortedData], data => {
  if (!data || !data.length) return null;
  const topRegions = data.length > 10 ? data.slice(0, 10) : data;
  const totalGain = sumBy(data, 'gain');
  const otherRegions = data.length > 10 ? data.slice(10) : [];
  const othersGain = otherRegions.length && sumBy(otherRegions, 'gain');
  const otherRegionsData = otherRegions.length
    ? {
      label: 'Other regions',
      percentage: othersGain ? othersGain / totalGain * 100 : 0,
      color: otherRegions[0].color
    }
    : {};

  return [...topRegions, otherRegionsData];
});

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
    const totalGain = sumBy(data, 'gain');
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data.length && data[0];
    const avgGainPercentage = sumBy(data, 'percentage') / data.length;
    const avgGain = sumBy(data, 'gain') / data.length;
    let percentileGain = 0;
    let percentileLength = 0;
    let sentence = '';

    if (indicator.value !== 'gadm28') {
      sentence += `For <b>${
        indicator.label
      }</b> in <b>${currentLocation}</b>, `;
    } else {
      sentence += `In <b>${currentLocation}</b>, `;
    }
    while (
      (percentileLength < data.length && percentileGain / totalGain < 0.5) ||
      (percentileLength < 10 && data.length > 10)
    ) {
      percentileGain += data[percentileLength].gain;
      percentileLength += 1;
    }
    const topGain = percentileGain / totalGain * 100;

    if (percentileLength > 1) {
      sentence += `the top <b>${percentileLength}</b> regions were responsible <b>`;
    } else {
      sentence += `<b>${topRegion.label}</b> was responsible <b>`;
    }
    if (!location.region) {
      sentence += `more than half (${format('.0f')(topGain)}%)`;
    } else {
      sentence += `${format('.0f')(topGain)}%`;
    }
    sentence += '</b> of all region tree cover gain. ';
    sentence += `${
      percentileLength > 1 ? `<b>${topRegion.label}</b>` : 'This region'
    } has the largest tree cover gain at `;
    if (topRegion.percentage > 1 && settings.unit === '%') {
      sentence += `<b>${format('.0f')(
        topRegion.percentage
      )}%</b> compared to an average of <b>${format('.0f')(
        avgGainPercentage
      )}%</b>.`;
    } else {
      sentence += `<b>${format('.3s')(
        topRegion.gain
      )}ha</b> compared to an average of <b>${format('.3s')(avgGain)}ha</b>.`;
    }

    return sentence;
  }
);
