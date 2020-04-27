import qs from 'query-string';

import oldLayers from 'data/v2-v3-datasets-layers.json';

const oldLayersAndDatasets = oldLayers.reduce(
  (obj, item) => ({
    ...obj,
    ...(item.v2_dataset_id && {
      [item.v2_dataset_id]: item.v3_dataset_id,
    }),
    ...(item.v2_layer_id && {
      [item.v2_layer_id]: item.v3_layer_id,
    }),
  }),
  {}
);

export const decodeUrlForState = (params) => {
  const paramsParsed = {};
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
                dataset:
                  oldLayersAndDatasets[dataset.dataset] || dataset.dataset,
                layers: dataset.layers.reduce(
                  (lArr, layerId) => [
                    ...lArr,
                    oldLayersAndDatasets[layerId] || layerId,
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

export const encodeStateForUrl = (params) => {
  const paramsParsed = {};
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'object') {
      paramsParsed[key] = btoa(JSON.stringify(params[key]));
    } else {
      paramsParsed[key] = params[key];
    }
  });
  return qs.stringify(paramsParsed);
};
