import { getSoilOrganicCarbon } from 'services/climate';

import {
  POLITICAL_BOUNDARIES_DATASET,
  SOIL_CARBON_DENSITY_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  SOIL_CARBON_DENSITY
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'soilOrganic',
  title: {
    default: 'Soil organic carbon in {location}',
    global: 'Global soil organic carbon'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'variable',
      label: 'variable',
      type: 'switch',
      whitelist: ['totalbiomass', 'biomassdensity']
    }
  ],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // soil organis carbon
    {
      dataset: SOIL_CARBON_DENSITY_DATASET,
      layers: [SOIL_CARBON_DENSITY]
    }
  ],
  refetchKeys: ['variable'],
  chartType: 'lollipop',
  visible: ['dashboard', 'analysis'],
  colors: 'climate',
  metaKey: 'soil_organic_carbon',
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  settings: {
    startYear: 2001,
    endYear: 2018,
    pageSize: 5,
    page: 0,
    variable: 'totalbiomass'
  },
  sentences: {
    initial:
      'In 2000, {location} had a soil organic carbon density of {biomassDensity}, and a total carbon storage of {totalBiomass}.',
    totalbiomass:
      'Around {value} of the world’s {label} is contained in the top 5 countries.',
    biomassdensity:
      'The average {label} of the world’s top 5 countries is {value}.'
  },
  getData: params =>
    getSoilOrganicCarbon(params).then(res => res.data && res.data.rows),
  getDataURL: params => [getSoilOrganicCarbon({ ...params, download: true })],
  getWidgetProps
};
