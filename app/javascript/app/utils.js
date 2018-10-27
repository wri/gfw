import compact from 'lodash/compact';
import { MAP, MAP_EMBED } from './router';

const layerSpec = {
  loss: {
    dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
    id: 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6'
  }
};

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

export const getNewMapRedirect = ({ slugs, query }) => {
  const embed = slugs.includes('embed');
  const params = slugs.reduce(
    (obj, param, index) => ({
      ...obj,
      [embed ? embedParamKeys[index] : paramKeys[index]]:
        parseInt(param, 10) || param
    }),
    {}
  );
  const { zoom, lat, lng, iso, layers } = params || {};
  const { tab, geostore, use, useid } = query || {};

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

  const layerSlugs = layers && layers.split(',');
  const datasets =
    layerSlugs &&
    compact(
      layerSlugs.map(
        l =>
          (layerSpec[l]
            ? {
              dataset: layerSpec[l].dataset,
              layers: [layerSpec[l].id],
              opacity: 1,
              visibility: true
            }
            : null)
      )
    );

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
        datasets: [
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
          ...datasets
        ]
      },
      analysis: {
        showAnalysis: tab === 'analysis-tab'
      }
    }
  };
};
