import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';
import { translateText } from 'utils/lang';

const getInteractionData = (state, { data }) => data;

export const getSentence = createSelector(
  [getInteractionData],
  ({ data } = {}) => {
    const { adm_level, gid_0, name_1, country } = data;
    let name = data[`name_${adm_level || '0'}`];

    if (!gid_0) {
      name = data[Object.keys(data).find((k) => k.includes('name'))];
    }

    const area = data[Object.keys(data).find((k) => k.includes('area'))];
    const locationNameTranslated = translateText(name);

    let locationNames = [locationNameTranslated];

    if (adm_level === 2) {
      locationNames = [
        locationNameTranslated,
        translateText(name_1),
        translateText(country),
      ];
    } else if (adm_level === 1) {
      locationNames = [locationNameTranslated, translateText(country)];
    }

    const locationName = locationNames.join(', ');

    const params = {
      location: locationName,
      area: formatNumber({ num: area, unit: 'ha' }),
    };

    const sentence = translateText('{location}, with a total area of {area}.');

    return {
      sentence,
      params,
    };
  }
);

export const getBoundarySentenceProps = createStructuredSelector({
  sentence: getSentence,
});
