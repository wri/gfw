import { translateText } from './lang';

const translateGeodescriberParams = ({ params = {}, excludeKeys = [] }) => {
  const paramsKeys = Object.keys(params);

  if (!paramsKeys.length) return {};

  return paramsKeys.reduce((translatedParams, paramKey) => {
    const paramValue = params[paramKey];
    const shouldTranslateParam = !excludeKeys.includes(paramKey);

    return {
      ...translatedParams,
      [paramKey]: shouldTranslateParam ? translateText(paramValue) : paramValue,
    }
  }, {});
};

const isGeodescriberLocation = (location) => {
  return !['global', 'country'].includes(location?.type);
}

const dynamicGeodescriberSentence = (sentence, params) => {
  // adding space between number and unit for area_0, if it exists
  const areaFormatted = params?.area_0?.replace(
    /([\d|.|,]+)/,
    '$1 '
  );

  // geodescriber params need to be translated as well
  // area_0 is a known area value that is formatted above, so we'll not translate that one as to prevent
  // cluttering transifex with area values.
  const translatedDescriptionParams = translateGeodescriberParams({
    params, excludeKeys: ['area_0'],
  });

  return {
    sentence,
    params: {
      ...translatedDescriptionParams,
      area_0: areaFormatted,
    },
  };
};

export {
  isGeodescriberLocation,
  dynamicGeodescriberSentence,
};
