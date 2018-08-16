import basemaps, { labels } from './components/basemaps/basemaps-schema';

export default {
  center: {
    lat: 27,
    lng: 12
  },
  zoom: 3,
  zoomControl: false,
  maxZoom: 19,
  minZoom: 2,
  basemap: basemaps.default,
  label: labels.default,
  attributionControl: false,
  layers: [
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
      opacity: 1,
      visibility: true
    }
  ]
};
