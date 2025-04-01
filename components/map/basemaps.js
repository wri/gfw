import { PROXIES } from 'utils/proxies';

import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

export default {
  default: {
    label: 'default',
    value: 'default',
    baseStyle: true,
    backgroundColor: '#A2DFFF',
    image: defaultImage,
    hasSettings: false,
    basemapGroup: 'basemap-light',
    labelsGroup: 'labels-light',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
  },
  dark: {
    label: 'dark matter',
    value: 'dark',
    color: '#31312F',
    baseStyle: true,
    image: darkImage,
    hasSettings: false,
    basemapGroup: 'basemap-dark',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
  },
  satellite: {
    label: 'Google satellite imagery',
    description: 'Highest resolution imagery 1-3 years old (global)',
    value: 'satellite',
    color: '#131620',
    baseStyle: false,
    hasSettings: false,
    infoModal: 'satellite_basemap',
    caveat: '(global)',
    image: satelliteImage,
    basemapGroup: 'basemap-satellite',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  },
  landsat: {
    label: 'Landsat satellite imagery',
    description: 'Coarse resolution imagery (global)',
    value: 'landsat',
    color: '#0C0045',
    baseStyle: false,
    hasSettings: true,
    infoModal: 'landsat_basemap',
    image: landsatImage,
    basemapGroup: 'basemap-landsat',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
    url: `${PROXIES.GFW_API}/v2/landsat-tiles/{year}/{z}/{x}/{y}`,
    availableYears: [2017, 2016, 2015, 2014, 2013],
    defaultYear: 2017,
  },
  recentImagery: {
    label: 'landsat 8 / sentinel 2',
    description:
      'Latest satellite imagery available from Sentinel-2 and Landsat 8',
    value: 'recentImagery',
    backgroundColor: '#A2DFFF',
    baseStyle: false,
    image: defaultImage,
    hasSettings: true,
    infoModal: 'recent_satellite_imagery',
    basemapGroup: 'basemap-light',
    labelsGroup: 'labels-light',
    mapStyle: 'mapbox://styles/resourcewatch/ckgrx1ak30npt19o10xxkeqli',
  },
};
