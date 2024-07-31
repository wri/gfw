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
    if (!data?.length) return null;

    const yearData = data.find((entry) => entry?.year === settings?.year);

    if (yearData?.all === null) return null;

    const items = {
      logging: 'Logging',
      gathering: 'Gathering of non-wood products',
      support: 'Support services to forestry',
      silviculture: 'Silviculture and other forestry activities',
    };

    const formattedData = Object.keys(items).reduce((acc, key) => {
      const label = items[key];
      const value = yearData[key];
      const percentage = (100 * value) / yearData?.all;
      const color = colors[key];

      if (!value) return acc;
      return [
        ...acc,
        { label, value: percentage, percentage, color, unit: '%' },
      ];
    }, []);

    return formattedData;
  }
);

export const parseSentence = createSelector(
  [getSentences, getData, getSettings, getLocation],
  (sentences, data, settings, location) => {
    if (!data?.length) return null;

    const yearData = data.find((entry) => entry?.year === settings?.year);
    const sentence = yearData?.female
      ? sentences.withFemales
      : sentences.initial;
    const femalePercentage = (yearData?.female * 100) / yearData?.all;

    if (yearData?.all === null) return null;

    return {
      sentence,
      params: {
        numPeople: formatNumber({ num: yearData?.all, unit: 'countsK' }),
        year: settings?.year,
        femalePercent: formatNumber({ num: femalePercentage, unit: '%' }),
        location: location?.label,
      },
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
});
