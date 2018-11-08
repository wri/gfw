import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

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
    image: defaultImage,
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhwaoh211hp2stemfz0imqf/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  dark: {
    id: 'dark',
    label: 'dark matter',
    color: '#31312F',
    image: darkImage,
    url: `https://api.mapbox.com/styles/v1/resourcewatch/cjlhtst4i0m7e2rmijubkv4y9/tiles/256/{z}/{x}/{y}@2x?access_token=${
      MAPBOX_TOKEN
    }`
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    color: '#131620',
    image: satelliteImage,
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
  },
  landsat: {
    id: 'landsat',
    label: 'landsat',
    dynamic: true,
    color: '#0C0045',
    image: landsatImage,
    defaultUrl:
      'https://storage.googleapis.com/landsat-cache/{year}/{z}/{x}/{y}.png',
    availableYears: [2017, 2016, 2015, 2014, 2013]
  }
};
