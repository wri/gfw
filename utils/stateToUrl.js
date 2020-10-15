import queryString from 'query-string';
import legacyIds from 'data/legacy-ids.json';
import isEmpty from 'lodash/isEmpty';

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

export const decodeParamsForState = (params) => {
  const paramsParsed = {};
  Object.keys(params).forEach((key) => {
    try {
      paramsParsed[key] = JSON.parse(
        Buffer.from(params[key], 'base64').toString('binary')
      );
    } catch (err) {
      try {
        paramsParsed[key] = JSON.parse(params[key]);
      } catch (error) {
        paramsParsed[key] = params[key];
      }
    }
  });

  if (paramsParsed.map) {
    paramsParsed.map = {
      ...paramsParsed.map,
      ...(paramsParsed.map.datasets && {
        datasets:
          paramsParsed.map &&
          paramsParsed.map.datasets.reduce(
            (arr, dataset) => [
              ...arr,
              {
                ...dataset,
                dataset: idToSlugDict[dataset.dataset] || dataset.dataset,
                layers: dataset.layers.reduce(
                  (lArr, layerId) => [
                    ...lArr,
                    idToSlugDict[layerId] || layerId,
                  ],
                  []
                ),
              },
            ],
            []
          ),
      }),
    };
  }

  return paramsParsed;
};

export const decodeUrlForState = (url) => {
  const paramsParsed = {};
  const params = queryString.parse(url);
  Object.keys(params).forEach((key) => {
    try {
      paramsParsed[key] = JSON.parse(atob(params[key]));
    } catch (err) {
      paramsParsed[key] = params[key];
    }
  });

  if (paramsParsed.map) {
    paramsParsed.map = {
      ...paramsParsed.map,
      ...(paramsParsed.map.datasets && {
        datasets:
          paramsParsed.map &&
          paramsParsed.map.datasets.reduce(
            (arr, dataset) => [
              ...arr,
              {
                ...dataset,
                dataset: idToSlugDict[dataset.dataset] || dataset.dataset,
                layers: dataset.layers.reduce(
                  (lArr, layerId) => [
                    ...lArr,
                    idToSlugDict[layerId] || layerId,
                  ],
                  []
                ),
              },
            ],
            []
          ),
      }),
    };
  }

  return paramsParsed;
};

export const encodeStateForUrl = (params, options) => {
  const paramsParsed = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] &&
      typeof params[key] === 'object' &&
      !isEmpty(params[key])
    ) {
      paramsParsed[key] = btoa(JSON.stringify(params[key]));
    } else if (typeof params[key] !== 'object' && params[key]) {
      paramsParsed[key] = params[key];
    }
  });

  return queryString.stringify(paramsParsed, options);
};
