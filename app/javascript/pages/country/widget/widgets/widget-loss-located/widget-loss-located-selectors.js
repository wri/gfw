import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey, getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getLoss = state => state.loss || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector(
  [getLoss, getExtent, getSettings, getLocation, getLocationsMeta, getColors],
  (data, extent, settings, location, meta, colors) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const { startYear, endYear } = settings;
    const mappedData = data.map(d => {
      const region = meta.find(l => d.id === l.value);
      const loss =
        sumBy(
          d.loss.filter(l => l.year >= startYear && l.year <= endYear),
          'area_loss'
        ) || 0;
      const locationExtent = extent.filter(l => l.id === d.id);
      const percentage = loss / locationExtent[0].extent * 100;
      return {
        label: (region && region.label) || '',
        loss,
        percentage,
        value: settings.unit === 'ha' ? loss : percentage,
        path: `/country/${location.country}/${
          location.region ? `${location.region}/` : ''
        }${d.id}`
      };
    });
    const sortedData = sortByKey(uniqBy(mappedData, 'label'), 'value', true);
    const colorRange = getColorPalette(
      colors.ramp,
      sortedData.length < 10 ? sortedData.length : 10
    );

    return sortedData.map((o, i) => ({
      ...o,
      color: o.loss ? colorRange[i] || colorRange[9] : colors.noLoss
    }));
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
    const { startYear, endYear } = settings;
    const totalLoss = sumBy(data, 'loss');
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data.length && data[0];
    const avgLossPercentage = sumBy(data, 'percentage') / data.length;
    const avgLoss = sumBy(data, 'loss') / data.length;
    let percentileLoss = 0;
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
      (percentileLength < data.length && percentileLoss / totalLoss < 0.5) ||
      (percentileLength < 10 && data.length > 10)
    ) {
      percentileLoss += data[percentileLength].loss;
      percentileLength += 1;
    }
    const topLoss = percentileLoss / totalLoss * 100;

    if (percentileLength > 1) {
      sentence += `the top <b>${percentileLength}</b> regions were responsible for <b>`;
    } else {
      sentence += `<b>${topRegion.label}</b> was responsible for <b>`;
    }
    if (!location.region) {
      sentence += `more than half (${format('.0f')(topLoss)}%)`;
    } else {
      sentence += `${format('.0f')(topLoss)}%`;
    }
    sentence += `</b> of all tree cover loss between <b>${startYear}</b> and <b>${endYear}</b>. `;
    sentence += `${
      percentileLength > 1 ? `<b>${topRegion.label}</b>` : 'This region'
    } had the largest${
      settings.unit === '%' ? ' relative' : ''
    } tree cover loss at `;
    if (topRegion.percentage > 1 && settings.unit === '%') {
      sentence += `<b>${format('.0f')(
        topRegion.percentage
      )}%</b> compared to an average of <b>${format('.0f')(
        avgLossPercentage
      )}%</b>.`;
    } else {
      sentence += `<b>${format('.3s')(
        topRegion.loss
      )}ha</b> compared to an average of <b>${format('.3s')(avgLoss)}ha</b>.`;
    }

    return sentence;
  }
);
