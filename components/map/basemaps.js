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
    basemapGroup: 'basemap-light',
    labelsGroup: 'labels-light',
    mapStyle: 'mapbox://styles/resourcewatch/ckd6wptd60dmq1ilp73ulv6xv',
  },
  dark: {
    label: 'dark matter',
    value: 'dark',
    color: '#31312F',
    image: darkImage,
    basemapGroup: 'basemap-dark',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckd6wptd60dmq1ilp73ulv6xv',
  },
  satellite: {
    label: 'Satellite',
    value: 'satellite',
    color: '#131620',
    image: satelliteImage,
    basemapGroup: 'basemap-satellite',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckd6wptd60dmq1ilp73ulv6xv',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  },
  landsat: {
    label: 'landsat',
    value: 'landsat',
    color: '#0C0045',
    image: landsatImage,
    basemapGroup: 'basemap-landsat',
    labelsGroup: 'labels-dark',
    mapStyle: 'mapbox://styles/resourcewatch/ckd6wptd60dmq1ilp73ulv6xv',
    url:
      'https://production-api.globalforestwatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    availableYears: [2019, 2018, 2017, 2016, 2015, 2014, 2013],
    defaultYear: 2019,
  },
};
