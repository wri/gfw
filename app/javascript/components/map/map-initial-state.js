export default {
  center: {
    lat: 27,
    lng: 12
  },
  zoom: 3,
  zoomControl: false,
  maxZoom: 19,
  minZoom: 2,
  basemap: {
    url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
  },
  label: {
    url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
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
