import { translateText } from './lang';

export const translateGeodescriberParams = ({ params = {}, excludeKeys = [] }) => {
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
