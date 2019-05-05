import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

export default {
  default: {
    label: 'default',
    backgroundColor: '#A2DFFF',
    image: defaultImage,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc'
  },
  dark: {
    label: 'dark matter',
    color: '#31312F',
    image: darkImage,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc'
  },
  satellite: {
    label: 'Satellite',
    color: '#131620',
    image: satelliteImage,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
  },
  landsat: {
    label: 'landsat',
    color: '#0C0045',
    image: landsatImage,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc',
    url:
      'https://production-api.globalforestwatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    availableYears: [2017, 2016, 2015, 2014, 2013],
    defaultYear: 2017
  },
  planet: {
    label: 'Planet',
    color: '#131620',
    image: satelliteImage,
    mapStyle: 'mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc',
    url: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_{frequency}_{period}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${
      process.env.PLANET_API_KEY
    }`
  }
};
