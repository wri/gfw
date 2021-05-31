import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

export default {
  default: {
    label: 'default',
    value: 'default',
    static: true,
    backgroundColor: '#A2DFFF',
    image: defaultImage,
    basemapGroup: 'basemap-light',
    labelsGroup: 'labels-light',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
  },
  dark: {
    label: 'dark matter',
    value: 'dark',
    color: '#31312F',
    static: true,
    image: darkImage,
    basemapGroup: 'basemap-dark',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
  },
  planet: {
    label: 'Planet',
    description: 'Monthly high resolution basemaps (tropics).',
    value: 'planet',
    color: '#131620',
    static: false,
    image: satelliteImage,
    basemapGroup: 'basemap-dark',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
    url: `/api/planet-tiles/{name}/gmap/{z}/{x}/{y}/?proc={color}`,
  },
  satellite: {
    label: 'google',
    description: 'Highest resolution imagery 1-3 years old (global).',
    value: 'satellite',
    color: '#131620',
    static: false,
    image: satelliteImage,
    basemapGroup: 'basemap-satellite',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  },
  landsat: {
    label: 'landsat',
    description: 'Coarse resolution imagery (global).',
    value: 'landsat',
    color: '#0C0045',
    static: false,
    image: landsatImage,
    basemapGroup: 'basemap-landsat',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
    url:
      'https://production-api.globalforestwatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    availableYears: [2017, 2016, 2015, 2014, 2013],
    defaultYear: 2017,
  }
};
