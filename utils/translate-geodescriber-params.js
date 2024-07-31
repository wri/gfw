import { translateText } from './lang';

export const translateGeodescriberParams = ({params = {}, excludeKeys = []}) => {
  const paramsKeys = Object.keys(params);

  if (!paramsKeys.length) return {};

  return paramsKeys.reduce((translatedParams, key) => {
    const paramValue = params[key];
    const shouldTranslate = !excludeKeys.includes(key);

    return {
      ...translatedParams,
      [key]: shouldTranslate ? translateText(paramValue) : paramValue,
    }
  }, {});
};
