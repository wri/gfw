import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';
import { translateText } from 'utils/lang';

const getInteractionData = (state, { data }) => data;

/**
 * Returns an object with the selected location name, its area and a sentence do be displayed.
 * @param {method} createSelector - return a memoized output selector.
 * @see https://reselect.js.org/introduction/getting-started/#output-selector for implementation details
 * @param {selector} getInteractionData - data from the area clicked by user
 * @return {object} sentence, location name and area.
 */
export const getSentence = createSelector(
  [getInteractionData],
  ({ data } = {}) => {
    const { adm_level, gid_0, name_1, name_0, country } = data;
    let name = adm_level > 0 ? data[`name_${adm_level}`] : country || name_0;

    if (!gid_0) {
      name = data[Object.keys(data).find((k) => k.includes('name'))];
    }

    const area = data[Object.keys(data).find((k) => k.includes('area'))];
    const locationNameTranslated = translateText(name);

    let locationNames = [locationNameTranslated];

    if (Number(adm_level) === 2) {
      locationNames = [
        locationNameTranslated,
        translateText(name_1),
        translateText(country || name_0),
      ];
    }

    if (Number(adm_level) === 1) {
      locationNames = [
        locationNameTranslated,
        translateText(country || name_0),
      ];
    }

    const locationName = locationNames.join(', ');
    const sentence = translateText('{location}, with a total area of {area}.');
    const params = {
      location: locationName,
      area: formatNumber({ num: area, unit: 'ha' }),
    };

    return {
      sentence,
      params,
    };
  }
);

export const getBoundarySentenceProps = createStructuredSelector({
  sentence: getSentence,
});
