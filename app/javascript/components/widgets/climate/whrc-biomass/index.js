import { getBiomassRanking } from 'services/climate';

import getWidgetProps from './selectors';

export default {
  widget: 'whrc-biomass',
  title: {
    default: 'Aboveground live woody biomass in {location}',
    global: 'Global aboveground live woody biomass'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    thresholds: true,
    variables: ['totalbiomass', 'biomassdensity']
  },
  chartType: 'rankedList',
  datasets: [
    // above ground woody biomass
    {
      dataset: '81c802aa-5feb-4fbe-9986-8f30c0597c4d',
      layers: ['f10bded4-94e2-40b6-8602-ae5bdfc07c08']
    }
  ],
  analysis: true,
  colors: 'climate',
  metaKey: 'aboveground_biomass',
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentences: {
    initial:
      'In 2000, {location} had an aboveground live woody biomass density of {biomassDensity}, and a total biomass of {totalBiomass}.'
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
    extentYear: 2000,
    layers: ['loss'],
    pageSize: 5,
    page: 0,
    variable: 'totalbiomass'
  },
  getData: params =>
    getBiomassRanking({ ...params }).then(res => res.data && res.data.rows),
  getWidgetProps
};
