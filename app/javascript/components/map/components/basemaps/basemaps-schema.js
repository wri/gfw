const { MAPBOX_TOKEN } = process.env;

export const labels = {
  default: {
    id: 'default',
    value: 'default',
    label: 'Default',
    url: `https://api.mapbox.com/styles/v1/edbrett/cjknwadi312uf2ro4dtt40eu0/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  noLabels: {
    id: 'noLabels',
    label: 'No Labels',
    url: ''
  }
};

export default {
  default: {
    id: 'default',
    value: 'default',
    label: 'default',
    url: `https://api.mapbox.com/styles/v1/edbrett/cjknvzjev2bl92rmno1rr9ivr/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  dark: {
    id: 'dark',
    label: 'dark matter',
    url: 'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
  },
  landsat: {
    id: 'landsat',
    label: 'landsat',
    dynamic: true,
    defaultUrl:
      'https://storage.googleapis.com/landsat-cache/{year}/{z}/{x}/{y}.png',
    availableYears: [2013, 2014, 2015, 2016, 2017]
  },
  openstreet: {
    id: 'openstreet',
    label: 'open street maps',
    url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  positron: {
    id: 'positron',
    label: 'positron',
    url: 'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
  },
  tree_height: {
    id: 'tree_height',
    label: 'tree height',
    url: 'https://s3.amazonaws.com/wri-tiles/tree-height/{z}/{x}/{y}.png'
  }
};
