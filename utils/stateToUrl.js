import queryString from 'query-string';
import oldLayers from 'data/v2-v3-datasets-layers.json';
import basemaps from 'components/map/basemaps';
import isEmpty from 'lodash/isEmpty';

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

  if (
    paramsParsed.map &&
    paramsParsed.map.basemap &&
    paramsParsed.map.basemap.value === 'planet'
  ) {
    paramsParsed.planetNotice = true;
  }

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
      ...(paramsParsed.map.basemap &&
        paramsParsed.map.basemap.value === 'planet' && {
          basemap: {
            value: 'landsat',
            year: basemaps.landsat.availableYears.includes(
              paramsParsed.map.basemap.planetYear
            )
              ? paramsParsed.map.basemap.planetYear
              : basemaps.landsat.defaultYear,
          },
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
    } else if (params[key] && !isEmpty(params[key])) {
      paramsParsed[key] = params[key];
    }
  });

  return queryString.stringify(paramsParsed, options);
};
