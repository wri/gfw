const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export default {
  default: {
    id: 'default',
    name: 'default',
    url: `https://api.mapbox.com/styles/v1/edbrett/cjknvzjev2bl92rmno1rr9ivr/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  dark: {
    id: 'dark',
    name: 'dark matter',
    url: 'https://a.basemaps.cartocdn.com/dark_nolabels/{0}/{1}/{2}.png'
  },
  landsat: {
    id: 'landsat',
    name: 'landsat',
    url: 'beats me!'
  },
  openstreet: {
    id: 'openstreet',
    name: 'open street maps',
    url: 'https://a.tile.openstreetmap.org/{0}/{1}/{2}.png'
  },
  positron: {
    id: 'positron',
    name: 'positron',
    url: 'https://a.basemaps.cartocdn.com/light_nolabels/{0}/{1}/{2}.png'
  },
  tree_height: {
    id: 'tree_height',
    name: 'tree height',
    url: 'https://s3.amazonaws.com/wri-tiles/tree-height/{0}/{1}/{2}.png'
  }
};
