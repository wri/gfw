import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

export default {
  default: {
    label: 'default',
    value: 'default',
    backgroundColor: '#A2DFFF',
    image: defaultImage,
    mapStyle:
      'mapbox://styles/resourcewatch/cjwhvxi9005u51cpa6dxjac7o?fresh=true'
  },
  dark: {
    label: 'dark matter',
    value: 'dark',
    color: '#31312F',
    image: darkImage,
    mapStyle:
      'mapbox://styles/resourcewatch/cjwt4gn0m04uu1cpanx2wq1bu?fresh=true'
  },
  satellite: {
    label: 'Satellite',
    value: 'satellite',
    color: '#131620',
    image: satelliteImage,
    mapStyle:
      'mapbox://styles/resourcewatch/cjvfcpw8n0dfd1fqfz59o63uq?fresh=true',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
  },
  landsat: {
    label: 'landsat',
    value: 'landsat',
    color: '#0C0045',
    image: landsatImage,
    mapStyle:
      'mapbox://styles/resourcewatch/cjvfcryns0hww1fqnxc44yeyr?fresh=true',
    url:
      'https://production-api.globalforestwatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    availableYears: [2017, 2016, 2015, 2014, 2013],
    defaultYear: 2017
  },
  planet: {
    label: 'Planet',
    value: 'planet',
    color: '#131620',
    image: satelliteImage,
    mapStyle:
      'mapbox://styles/resourcewatch/cjvfcpw8n0dfd1fqfz59o63uq?fresh=true',
    url: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_{frequency}_{period}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${
      process.env.PLANET_API_KEY
    }`
  }
};
