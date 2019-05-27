import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

const getData = state => state.data;
const getLocationName = state => state.locationName;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;
const getTitle = state => state.config.title;
const getSettings = state => state.settings;

export const parseData = createSelector(
  [getData, getColors, getSettings],
  (data, colors, settings) => {
    if (isEmpty(data)) return null;
    const { adminData, plantData } = data;
    const { loss } = colors;

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
        value:
          settings.unit === 'co2LossByYear'
            ? adminTotal
            : adminTotal / (44 / 12),
        unit: settings.unit === 'co2LossByYear' ? 'tCO₂' : 'tC',
        color: loss.main,
        percentage: totalArea > 0 ? adminTotal / totalArea * 100 : 0
      },
      {
        label: 'Plantations',
        value:
          settings.unit === 'co2LossByYear'
            ? plantTotal
            : plantTotal / (44 / 12),
        unit: settings.unit === 'co2LossByYear' ? 'tCO₂' : 'tC',
        color: loss.secondary,
        percentage: totalArea > 0 ? plantTotal / totalArea * 100 : 0
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
          ? '< 0.1%'
          : formatNumber({ num: plantationsPct, unit: '%' }),
      emissions: formatNumber({ num: emissions, unit: 't' }),
      startYear,
      endYear,
      variable: settings.unit === 'co2LossByYear' ? 'CO₂' : 'carbon'
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
