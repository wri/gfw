import { translateText } from './lang';

const isGeodescriberLocation = (location) => {
  return !['global', 'country'].includes(location?.type);
};

const translateSentenceParams = ({ params = {}, excludeKeys = [] }) => {
  const paramsKeys = Object.keys(params);

  if (!paramsKeys.length) return {};

  return paramsKeys.reduce((paramsAccumulator, paramKey) => {
    const paramValue = params[paramKey];
    const shouldTranslateParam = !excludeKeys.includes(paramKey);

    return {
      ...paramsAccumulator,
      [paramKey]: shouldTranslateParam ? translateText(paramValue) : paramValue,
    };
  }, {});
};

const formatAreaParams = ({ params = {}, includeKeys = [] }) => {
  const paramsKeys = Object.keys(params);

  if (!paramsKeys.length) return {};

  return paramsKeys.reduce((paramsAccumulator, paramKey) => {
    const paramValue = params[paramKey];
    const shouldFormatParam = includeKeys.includes(paramKey);

    return {
      ...paramsAccumulator,
      // We're not using the formatNumber utility here because this comes as a string from the endpoint.
      // It'd require complicated processing to know the actual unit (ha, kha, etc), pull out the number, then
      // use the formatNumber utility when we can just use regex to add the space between number and units.
      [paramKey]: shouldFormatParam
        ? params?.[paramKey]?.replace(/([\d|.|,]+)/, '$1 ')
        : paramValue,
    };
  }, {});
};

const dynamicGeodescriberSentence = (sentence, params) => {
  const translatedSentenceParams = translateSentenceParams({
    params,
    excludeKeys: ['area_0'], // we know this is always an area, let's not clutter Transifex
  });

  const formattedAreaParams = formatAreaParams({
    params,
    includeKeys: ['area_0'], // we know this is always an area, we just need to add a space between number and unit
  });

  return {
    sentence,
    params: {
      ...translatedSentenceParams,
      ...formattedAreaParams,
    },
  };
};

export { isGeodescriberLocation, dynamicGeodescriberSentence };
