import { createSelector, createStructuredSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';

import globalLandCoverCategories from 'data/global-land-cover-categories.json';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    let keys = [];
    globalLandCoverCategories.forEach((c) => {
      keys = keys.concat(c.classes);
    });
    const dataGrouped = [];
    keys.forEach((k, i) => {
      dataGrouped[i] = {
        key: k,
        value: sumBy(data, k) || 0,
      };
    });
    const total = sumBy(dataGrouped, 'value') || 0;
    const dataFiltered = dataGrouped.filter((d) => d.value);
    const dataMerged = [];
    globalLandCoverCategories.forEach((d, i) => {
      dataMerged[i] = {
        ...d,
        value:
          sumBy(
            dataFiltered.filter((o) => d.classes.indexOf(o.key) > -1),
            'value'
          ) || 0,
      };
    });
    const dataParsed = dataMerged
      .filter((el) => el.value !== 0)
      .map((el) => ({
        ...el,
        percentage: (100 * el.value) / total,
        value: el.value,
        color: colors.categories[el.label],
      }));
    return sortBy(
      dataParsed.filter((d) => d !== null),
      'value'
    ).reverse();
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getLocationName, getSentences],
  (data, settings, locationName, sentence) => {
    if (isEmpty(data) || !sentence) return null;
    const { year } = settings;
    const { label, value } = data[0];
    const params = {
      location: locationName,
      year,
      category: label,
      extent: `${format('.2s')(value)}ha`,
    };
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
