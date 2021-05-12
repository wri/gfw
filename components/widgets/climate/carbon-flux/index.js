import { getCarbonFlux } from 'services/analysis-cached';

// import OTFAnalysis from 'services/otf-analysis';

import biomassLossIsos from 'data/biomass-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  CARBON_EMISSIONS_DATASET,
} from 'data/datasets';

import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  CARBON_EMISSIONS,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'carbonFlux',
  title: 'Forest-related greenhouse gas emissions in {location}',
  large: true,
  categories: ['climate'],
  types: ['country', 'aoi', 'use', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  settingsConfig: [
    {
      key: 'gasesIncluded',
      label: 'Greenhouse gases included',
      type: 'select',
      border: true,
    },
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      whitelist: [30, 50, 75],
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
      dataset: CARBON_EMISSIONS_DATASET,
      layers: [CARBON_EMISSIONS],
    },
  ],
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold', 'landCategory', 'forestType'],
  visible: ['dashboard', 'analysis', 'aoi'],
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'climate',
  sortOrder: {
    climate: 2,
  },
  sentences: {
    initial:
      'Between {startYear} and {endYear}, forests in {location} emitted {totalEmissions}<strong>tCO2e/year</strong>, and removed {totalRemovals}<strong>tCO2e/year</strong>. This represents a net carbon flux of {totalFlux}<strong>tCO2e/year</strong>.',
    withIndicator:
      'Between {startYear} and {endYear}, forests within {indicator}, {location} emitted {totalEmissions}<b>/year</b>, and removed {totalRemovals}<b>/year</b>. This represents a net carbon flux of {totalFlux}<b>/year</b>.',
  },
  customComponent: 'CarbonFlux',
  settings: {
    gasesIncluded: 'allGases',
    threshold: 30,
    startYear: 2001,
    endYear: 2019, // or 2020
    unit: 'co2Gain',
  },
  whitelists: {
    adm0: biomassLossIsos,
  },
  getData: (params) => {
    return getCarbonFlux(params).then((flux) => {
      if (!flux || !flux.length) return [];
      return flux;
    });
  },
  getDataURL: (params) => [getCarbonFlux({ ...params, download: true })],
  getWidgetProps,
};
