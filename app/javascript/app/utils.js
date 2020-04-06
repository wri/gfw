import layerSpec from 'data/layerspec.json';
import {
  POLITICAL_BOUNDARIES_DATASET,
  RECENT_SATELLITE_IMAGERY_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  RECENT_SATELLITE_IMAGERY
} from 'data/layers';
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
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
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
              dataset: RECENT_SATELLITE_IMAGERY_DATASET,
              layers: [RECENT_SATELLITE_IMAGERY],
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
