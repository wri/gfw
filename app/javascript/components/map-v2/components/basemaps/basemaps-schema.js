const { MAPBOX_TOKEN } = process.env;

export const labels = {
  default: {
    id: 'default',
    value: 'default',
    label: 'Dark Labels',
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhxwcp212u02rpd1o541omv/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  lightLabels: {
    id: 'light-labels',
    value: 'light-labels',
    label: 'Light Labels',
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhxw8t412tv2rpdt33iuum3/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  noLabels: {
    id: 'noLabels',
    label: 'No Labels',
    value: 'no-labels',
    url: ''
  }
};

export default {
  default: {
    id: 'default',
    value: 'default',
    label: 'default',
    color: '#A2DFFF',
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhwaoh211hp2stemfz0imqf/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  dark: {
    id: 'dark',
    label: 'dark matter',
    color: '#31312F',
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhtst4i0m7e2rmijubkv4y9/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    color: '#131620',
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  landsat: {
    id: 'landsat',
    label: 'landsat',
    dynamic: true,
    color: '#0C0045',
    defaultUrl:
      'https://storage.googleapis.com/landsat-cache/{year}/{z}/{x}/{y}.png',
    availableYears: [2013, 2014, 2015, 2016, 2017]
  }
};
