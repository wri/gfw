import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getLocatonName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const { plantations } = data;
    const allColors = {
      ...colors.types,
      ...colors.species,
    };
    const totalPlantations = sumBy(plantations, 'intersection_area') || 0;
    return sortBy(
      plantations
        .filter((d) => d.intersection_area)
        .map((d) => ({
          label: d.plantations,
          value: d.intersection_area,
          color: allColors[d.plantations.toLowerCase()],
          percentage: (d.intersection_area / totalPlantations) * 100,
        })),
      'value'
    ).reverse();
  }
);

export const parseSentence = createSelector(
  [getData, parseData, getLocatonName, getSentences],
  (rawData, data, locationName, sentences) => {
    if (isEmpty(data) || !sentences) return null;

    const { initial } = sentences;
    const top = data.slice(0, 1);
    const areaPerc = (100 * (sumBy(top, 'value') || 0)) / rawData.totalArea;
    const topExtent = sumBy(top, 'value') || 0;
    const params = {
      location: locationName,
      extent: formatNumber({ num: topExtent, unit: 'ha', spaceUnit: true }),
      topType: top[0].label.toLowerCase(),
      percent: formatNumber({ num: areaPerc, unit: '%' }),
    };
    const sentence = initial;

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
});
