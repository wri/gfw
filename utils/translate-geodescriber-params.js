import { translateText } from './lang';

export const translateGeodescriberParams = (params = {}) => {
  const paramsKeys = Object.keys(params);
  if (!paramsKeys.length) return {};

  return paramsKeys.reduce((translatedParams, key) => ({
    ...translatedParams, [key]: translateText(params[key])
  }), {});
};
