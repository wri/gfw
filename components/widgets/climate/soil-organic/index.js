import { getOrganicSoilCarbonGrouped } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  SOIL_CARBON_DENSITY_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  SOIL_CARBON_DENSITY,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'soilOrganic',
  title: {
    default: 'Soil organic carbon in {location}',
    global: 'Global soil organic carbon',
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['totalBiomass', 'biomassDensity'],
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: SOIL_CARBON_DENSITY_DATASET,
      layers: [SOIL_CARBON_DENSITY],
    },
  ],
  refetchKeys: ['unit', 'threshold'],
  chartType: 'rankedList',
  visible: ['dashboard', 'analysis'],
  colors: 'climate',
  metaKey: 'soil_organic_carbon',
  sortOrder: {
    summary: 0,
    forestChange: 0,
  },
  settings: {
    startYear: 2001,
    endYear: 2018,
    pageSize: 5,
    page: 0,
    unit: 'totalBiomass',
    threshold: 30,
  },
  sentences: {
    region:
      'In 2000, {location} had a soil organic carbon density of {biomassDensity}, and a total soil carbon storage of {totalBiomass}.',
    globalBiomass:
      'Around {value} of the world’s {label} is contained in the top 5 countries.',
    globalDensity:
      'The average {label} of the world’s top 5 countries is {value}.',
  },
  getData: ({ type, adm0, adm1, adm2, ...rest } = {}) => {
    const location =
      type === 'country'
        ? {
            type,
            adm0: adm0 && !adm1 ? null : adm0,
            adm1: adm1 && !adm2 ? null : adm1,
            adm2: null,
          }
        : {
            type,
            adm0,
            adm1,
            adm2,
          };

    return getOrganicSoilCarbonGrouped({ ...rest, ...location });
  },
  getDataURL: ({ type, adm0, adm1, adm2, ...rest } = {}) => {
    const location =
      type === 'country'
        ? {
            type,
            adm0: adm0 && !adm1 ? null : adm0,
            adm1: adm1 && !adm2 ? null : adm1,
            adm2: null,
          }
        : {
            type,
            adm0,
            adm1,
            adm2,
          };
    return [
      getOrganicSoilCarbonGrouped({ ...rest, ...location, download: true }),
    ];
  },
  getWidgetProps,
};
