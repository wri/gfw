import layerSpec from 'data/layerspec.json';
import { MAP, MAP_EMBED } from './router';

const paramKeys = [
  'map',
  'zoom',
  'lat',
  'lng',
  'iso',
  'basemap',
  'layers',
  'subLayers'
];
const embedParamKeys = [
  'embed',
  'map',
  'zoom',
  'lat',
  'lng',
  'iso',
  'basemap',
  'layers',
  'subLayers'
];
const numParams = ['lat', 'lng', 'zoom'];

export const getNewMapRedirect = ({ slugs, query }) => {
  const embed = slugs.includes('embed');
  const keys = embed ? embedParamKeys : paramKeys;
  const params = slugs.reduce(
    (obj, param, index) => ({
      ...obj,
      [keys[index]]: numParams.includes(keys[index])
        ? parseInt(param, 10)
        : param
    }),
    {}
  );
  const layersBySlug = layerSpec.reduce(
    (obj, l) => ({
      ...obj,
      ...(l.slug && {
        [l.slug]: {
          ...l
        }
      })
    }),
    {}
  );
  const layersByCartoId = layerSpec.reduce(
    (obj, l) => ({
      ...obj,
      ...(l.cartodb_id && {
        [l.cartodb_id]: {
          ...l
        }
      })
    }),
    {}
  );

  const { zoom, lat, lng, iso, layers, subLayers } = params || {};
  const { tab, geostore, use, useid, wdpaid, subscribe, recentImagery } =
    query || {};

  const payload = {};
  if (iso !== 'ALL') {
    const isoIds = iso.split('-');
    payload.type = 'country';
    payload.adm0 = isoIds[0];
    payload.adm1 = isoIds[1];
    payload.adm2 = isoIds[2];
  }

  if (geostore) {
    payload.type = 'geostore';
    payload.adm0 = geostore;
  }

  if (use && useid) {
    payload.type = 'use';
    payload.adm0 = use;
    payload.adm1 = useid;
  }

  if (wdpaid) {
    payload.type = 'wdpa';
    payload.adm0 = wdpaid;
  }

  const layerSlugs = layers && layers.split(',');
  const subLayerIds =
    typeof subLayers === 'string' ? subLayers.split(',') : [subLayers];
  const layerIds = layerSlugs.concat(subLayerIds);

  const layerDatasets =
    layerIds &&
    layerIds.reduce((arr, id) => {
      const all = [...arr];
      const layer = layersBySlug[id] || layersByCartoId[id];
      const dataset = layer && layer.dataset;
      const datasetIndex = layer && all.findIndex(o => o.dataset === dataset);
      if (layer) {
        if (datasetIndex >= 0 && all && all.length) {
          all[datasetIndex] = {
            ...all[datasetIndex],
            layers: [layer.layer, ...all[datasetIndex].layers]
          };
          return all;
        }
        return all.concat([
          {
            dataset: layer.dataset,
            layers: [layer.layer],
            opacity: 1,
            visibility: true
          }
        ]);
      }
      return arr;
    }, []);

  const showAnalysis = tab === 'analysis-tab';

  const newDatasets = [
    // admin boundaries
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      opacity: 1,
      visibility: true
    },
    ...layerDatasets
  ];

  return {
    type: embed ? MAP_EMBED : MAP,
    payload,
    query: {
      map: {
        center: {
          lat,
          lng
        },
        zoom,
        canBound: (lat === '0' && lng === '0') || false,
        datasets: recentImagery
          ? newDatasets.concat([
            {
              dataset: '3668bb78-d77e-4215-bc2a-07433e204823',
              layers: ['babd9968-4b55-4bc5-b771-d471ef8fbd8c'],
              opacity: 1,
              visibility: true,
              isRecentImagery: true
            }
          ])
          : newDatasets
      },
      ...(showAnalysis && {
        analysis: {
          showAnalysis: tab === 'analysis-tab'
        }
      }),
      ...(subscribe && {
        subscribe: {
          open: true
        }
      })
    }
  };
};
