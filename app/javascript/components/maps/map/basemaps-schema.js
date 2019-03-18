import defaultImage from './images/default.png';
import darkImage from './images/dark.png';
import landsatImage from './images/landsat.png';
import satelliteImage from './images/satellite.png';

export const labels = {
  default: {
    value: 'default',
    label: 'Dark Labels',
    paint: {
      'text-color': '#1a1a1a',
      'text-halo-color': '#ffffff'
    },
    layout: {
      visibility: 'visible'
    }
  },
  lightLabels: {
    value: 'lightLabels',
    label: 'Light Labels',
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#1a1a1a'
    },
    layout: {
      visibility: 'visible'
    }
  },
  noLabels: {
    label: 'No Labels',
    value: 'noLabels',
    url: '',
    layout: {
      visibility: 'none'
    }
  }
};

export default {
  default: {
    value: 'default',
    label: 'default',
    labelsKey: 'default',
    color: '#A2DFFF',
    image: defaultImage,
    layerStyles: [
      {
        id: 'background',
        'background-color': '#ffffff'
      },
      {
        id: 'waterway-river-canal',
        'line-color': '#8dcbf7'
      },
      {
        id: 'waterway-river-canal-shadow',
        'line-color': '#6ea5f2'
      },
      {
        id: 'waterway-small',
        'line-color': '#8dcbf7'
      },
      {
        id: 'water',
        'fill-color': '#aedffd'
      }
    ]
  },
  dark: {
    value: 'dark',
    label: 'dark matter',
    labelsKey: 'lightLabels',
    color: '#31312F',
    image: darkImage,
    layerStyles: [
      {
        id: 'background',
        'background-color': '#31312f'
      },
      {
        id: 'waterway-river-canal',
        'line-color': '#000000'
      },
      {
        id: 'waterway-river-canal-shadow',
        'line-color': '#000000'
      },
      {
        id: 'waterway-small',
        'line-color': '#000000'
      },
      {
        id: 'water',
        'fill-color': '#20201d'
      }
    ]
  },
  satellite: {
    value: 'satellite',
    label: 'Satellite',
    labelsKey: 'lightLabels',
    color: '#131620',
    image: satelliteImage,
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    layerStyles: [
      {
        id: 'background',
        'background-color': '#ffffff'
      },
      {
        id: 'waterway-river-canal',
        'line-color': '#131620'
      },
      {
        id: 'waterway-river-canal-shadow',
        'line-color': '#131620'
      },
      {
        id: 'waterway-small',
        'line-color': '#131620'
      },
      {
        id: 'water',
        'fill-color': '#131620'
      }
    ]
  },
  planet: {
    value: 'planet',
    label: 'Planet',
    labelsKey: 'default',
    color: '#131620',
    image: satelliteImage,
    dynamic: true,
    url: `https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_{year}_{month}_mosaic/gmap/{z}/{x}/{y}.png?api_key=${
      process.env.PLANET_API_KEY
    }`,
    layerStyles: [
      {
        id: 'background',
        'background-color': '#ffffff'
      },
      {
        id: 'waterway-river-canal',
        'line-color': '#8dcbf7'
      },
      {
        id: 'waterway-river-canal-shadow',
        'line-color': '#6ea5f2'
      },
      {
        id: 'waterway-small',
        'line-color': '#8dcbf7'
      },
      {
        id: 'water',
        'fill-color': '#aedffd'
      }
    ]
  },
  landsat: {
    value: 'landsat',
    label: 'landsat',
    labelsKey: 'lightLabels',
    dynamic: true,
    color: '#0C0045',
    image: landsatImage,
    url:
      'https://production-api.globalforestwatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    availableYears: [2017, 2016, 2015, 2014, 2013],
    layerStyles: [
      {
        id: 'background',
        'background-color': '#ffffff'
      },
      {
        id: 'waterway-river-canal',
        'line-color': '#0C0045'
      },
      {
        id: 'waterway-river-canal-shadow',
        'line-color': '#0C0045'
      },
      {
        id: 'waterway-small',
        'line-color': '#0C0045'
      },
      {
        id: 'water',
        'fill-color': '#0C0045'
      }
    ]
  }
};
