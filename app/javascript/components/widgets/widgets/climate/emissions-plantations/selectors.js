import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationName;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;
const getTitle = state => state.config.title;
const getSettings = state => state.settings;

// get lists selected
export const parseData = createSelector(
  [getData, getColors, getSettings],
  (data, colors, settings) => {
    if (isEmpty(data)) return null;
    const { adminData, plantData } = data;

    const adminTotal = adminData
      .filter(d => d.year >= settings.startYear && d.year <= settings.endYear)
      .reduce((acc, next) => (next.emissions ? acc + next.emissions : acc), 0);

    const plantTotal = plantData
      .filter(d => d.year >= settings.startYear && d.year <= settings.endYear)
      .reduce((acc, next) => (next.emissions ? acc + next.emissions : acc), 0);
    const totalArea = adminTotal + plantTotal;
    const parsedData = [
      {
        label: 'Natural forest',
        value: adminTotal,
        color: colors.intactForest,
        percentage: adminTotal / totalArea * 100
      },
      {
        label: 'Plantations',
        value: plantTotal,
        color: colors.nonForest,
        percentage: plantTotal / totalArea * 100
      }
    ];
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getSentences, getSettings],
  (parsedData, locationName, sentences, settings) => {
    if (!parsedData) return null;
    const { initial } = sentences;
    const { startYear, endYear } = settings;
    const plantationsPct = parsedData.find(d => d.label === 'Plantations')
      .percentage;
    const emissions = parsedData.find(d => d.label === 'Natural forest').value;

    const params = {
      location: locationName !== 'global' ? `${locationName}'s` : locationName,
      percentage:
        plantationsPct < 0.1
          ? '<0.1%'
          : formatNumber({ num: plantationsPct, unit: '%' }),
      emissions: formatNumber({ num: emissions, unit: 't' }),
      startYear,
      endYear
    };

    return {
      sentence: initial,
      params
    };
  }
);

export const parseTitle = createSelector([getTitle], title => title.initial);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
