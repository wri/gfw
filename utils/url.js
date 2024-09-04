import { stringify } from 'query-string';
import isEmpty from 'lodash/isEmpty';

import legacyIds from 'data/legacy-ids.json';
import urlParam from 'utils/url-param';

const idToSlugDict = legacyIds.reduce(
  (obj, item) => ({
    ...obj,
    ...(item.v2_dataset_id && {
      [item.v2_dataset_id]: item.dataset_slug,
    }),
    ...(item.v3_dataset_id && {
      [item.v3_dataset_id]: item.dataset_slug,
    }),
    ...(item.v2_layer_id && {
      [item.v2_layer_id]: item.layer_slug,
    }),
    ...(item.v3_layer_id && {
      [item.v3_layer_id]: item.layer_slug,
    }),
  }),
  {}
);

// maps legacy ids for layers and datasets to application level slugs
const remapDatasets = (datasets) =>
  datasets?.reduce(
    (arr, dataset) => [
      ...arr,
      {
        ...dataset,
        dataset: idToSlugDict[dataset.dataset] || dataset.dataset,
        layers: dataset.layers?.reduce(
          (lArr, layerId) => [...lArr, idToSlugDict[layerId] || layerId],
          []
        ),
      },
    ],
    []
  );

export const decodeQueryParams = (params) => {
  const decodedParams = Object.keys(params)?.reduce((obj, key) => {
    try {
      return {
        ...obj,
        [key]: urlParam.decode(params[key]),
      };
    } catch (err) {
      try {
        return {
          ...obj,
          [key]: JSON.parse(params[key]),
        };
      } catch (error) {
        return {
          ...obj,
          [key]: params[key],
        };
      }
    }
  }, {});

  if (decodedParams?.map?.datasets) {
    decodedParams.map = {
      ...decodedParams.map,
      datasets: remapDatasets(decodedParams.map.datasets),
    };
  }

  return decodedParams;
};

export const encodeQueryParams = (params, options) => {
  const encodedParams = Object.keys(params)?.reduce((obj, key) => {
    // if params in an object encode in base64
    if (
      params[key] &&
      typeof params[key] === 'object' &&
      !isEmpty(params[key])
    ) {
      return { ...obj, [key]: urlParam.encode(params[key]) };
    }
    // if params is a valid key and not falsey
    if (typeof params[key] !== 'object' && params[key]) {
      return { ...obj, [key]: params[key] };
    }
    // otherwise ingore key
    return obj;
  }, {});

  return stringify(encodedParams, options);
};

export const ObjectToQueryString = (params) => {
  if (!params || isEmpty(params)) {
    return '';
  }
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  return `?${queryString}`;
};
