import basemaps from './components/basemaps/basemaps-schema';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

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
  label: {
    url: `https://api.mapbox.com/styles/v1/edbrett/cjknwadi312uf2ro4dtt40eu0/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
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
