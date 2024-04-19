import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';

const getData = (state) => state.data;
const getColors = (state) => state.colors;
const getLocation = (state) => state.location;
const getSentences = (state) => state.sentences;
const getSettings = (state) => state.settings;

export const parseData = createSelector(
  [getData, getColors, getSettings],
  (data, colors, settings) => {
    const yearData = data?.filter(({ year }) => year === settings?.year);
    const dataUngendered = yearData?.find(({ gender }) => gender === null);
    const dataAll = yearData?.find(({ gender }) => gender === 'all');

    if (!dataUngendered || !dataAll) return null;

    const items = {
      logging: 'Logging',
      gathering: 'Gathering of non-wood products',
      support: 'Support services to forestry',
      silviculture: 'Silviculture and other forestry activities',
    };

    const formattedData = Object.keys(items).reduce((acc, key) => {
      const label = items[key];
      const value = dataUngendered[key];
      const percentage = (100 * value) / dataAll?.all;
      const color = colors[key];

      if (!value) return acc;
      return [...acc, { label, value: percentage, percentage, color }];
    }, []);

    return formattedData;
  }
);

export const parseSentence = createSelector(
  [getSentences, getData, getSettings, getLocation],
  (sentences, data, settings, location) => {
    const yearData = data?.filter(({ year }) => year === settings?.year);
    const dataFemale = yearData?.find(({ gender }) => gender === 'female');
    const dataAll = yearData?.find(({ gender }) => gender === 'all');

    const sentence = dataFemale?.all ? sentences.withFemales : sentences.initial;
    const femalePercentage = (dataFemale?.all * 100) / dataAll?.all;

    if (!dataAll?.all) return null;

    return {
      sentence,
      params: {
        numPeople: formatNumber({ num: dataAll?.all, unit: 'countsK' }),
        year: settings?.year,
        femalePercent: formatNumber({ num: femalePercentage, unit: '%' }),
        location: location?.label
      },
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
});
