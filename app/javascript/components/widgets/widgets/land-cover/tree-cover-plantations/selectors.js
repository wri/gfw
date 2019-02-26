import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import endsWith from 'lodash/endsWith';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocatonName = state => state.locationName;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const { plantations } = data;
    const allColors = {
      ...colors.types,
      ...colors.species
    };
    const totalPlantations = sumBy(plantations, 'plantation_extent');

    return sortByKey(
      plantations.filter(d => d.plantation_extent).map(d => ({
        label: d.label,
        value: d.plantation_extent,
        color: allColors[d.label],
        percentage: d.plantation_extent / totalPlantations * 100
      })),
      'value',
      true
    );
  }
);

export const parseSentence = createSelector(
  [getData, parseData, getSettings, getLocatonName, getSentences],
  (rawData, data, settings, locationName, sentences) => {
    if (isEmpty(data) || !sentences) return null;
    const { initialSpecies, singleSpecies, initialTypes } = sentences;
    const top =
      settings.type === 'bound2' ? data.slice(0, 2) : data.slice(0, 1);
    const areaPerc = 100 * sumBy(top, 'value') / rawData.totalArea;
    const topExtent = sumBy(top, 'value');
    const otherExtent = sumBy(data.slice(2), 'value');
    const params = {
      location: locationName,
      firstSpecies: top[0].label.toLowerCase(),
      secondSpecies: top.length > 1 && top[1].label.toLowerCase(),
      type: settings.type === 'bound2' ? 'species' : 'type',
      extent:
        topExtent < 1
          ? `${format('.3r')(topExtent)}ha`
          : `${format('.3s')(topExtent)}ha`,
      other:
        otherExtent < 1
          ? `${format('.3r')(otherExtent)}ha`
          : `${format('.3s')(otherExtent)}ha`,
      count: data.length - top.length,
      topType: `${top[0].label}${endsWith(top[0].label, 's') ? '' : 's'}`,
      percent: areaPerc >= 0.1 ? `${format('.2r')(areaPerc)}%` : '< 0.1%'
    };
    const sentence =
      settings.type === 'bound1'
        ? initialTypes
        : `${top.length > 1 ? initialSpecies : singleSpecies}`;

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
