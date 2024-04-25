import { getCarbonFlux, getCarbonFluxOTF } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  CARBON_FLUX_DATASET,
  CARBON_REMOVALS_DATASET,
  CARBON_EMISSIONS_DATASET,
  CARBON_FLUX_DATASET_TEST,
  CARBON_REMOVALS_DATASET_TEST,
  CARBON_EMISSIONS_DATASET_TEST,
} from 'data/datasets';

import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  CARBON_FLUX,
  CARBON_REMOVALS,
  CARBON_EMISSIONS,
  CARBON_FLUX_TEST,
  CARBON_REMOVALS_TEST,
  CARBON_EMISSIONS_TEST,
} from 'data/layers';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'carbonFlux',
  title: {
    default: 'Forest-related greenhouse gas fluxes in {location}',
    global: 'Global Forest-related greenhouse gas fluxes',
  },
  large: true,
  categories: ['climate'],
  types: ['geostore', 'global', 'country', 'aoi', 'use', 'wdpa'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  chartType: 'verticalComposedChart',
  settingsConfig: [
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
      dataset: CARBON_FLUX_DATASET,
      layers: [CARBON_FLUX],
    },
    {
      dataset: CARBON_REMOVALS_DATASET,
      layers: [CARBON_REMOVALS],
    },
    {
      dataset: CARBON_EMISSIONS_DATASET,
      layers: [CARBON_EMISSIONS],
    },
    {
      dataset: CARBON_FLUX_DATASET_TEST,
      layers: [CARBON_FLUX_TEST],
    },
    {
      dataset: CARBON_REMOVALS_DATASET_TEST,
      layers: [CARBON_REMOVALS_TEST],
    },
    {
      dataset: CARBON_EMISSIONS_DATASET_TEST,
      layers: [CARBON_EMISSIONS_TEST],
    },
  ],
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold', 'landCategory', 'forestType'],
  visible: ['dashboard', 'analysis', 'aoi'],
  metaKey: 'gfw_widget_forest_carbon_net_flux_v20240308',
  dataType: 'flux',
  colors: 'climate',
  sortOrder: {
    climate: 2,
  },
  sentences: {
    globalInitial:
      'Between {startYear} and {endYear}, <strong>global</strong> forests emitted {totalEmissions}<b>/year</b>, and removed {totalRemovals}<b>/year</b>. This represents a {netCarbonFluxWording} of {totalFlux}<b>/year</b>.',
    globalWithIndicator:
      'Between {startYear} and {endYear}, <strong>global</strong> forests within {indicator} emitted {totalEmissions}<b>/year</b>, and removed {totalRemovals}<b>/year</b>. This represents a {netCarbonFluxWording} of {totalFlux}<b>/year</b>.',
    initial:
      'Between {startYear} and {endYear}, forests in {location} emitted {totalEmissions}<strong>/year</strong>, and removed {totalRemovals}<strong>/year</strong>. This represents a {netCarbonFluxWording} of {totalFlux}<strong>/year</strong>.',
    withIndicator:
      'Between {startYear} and {endYear}, forests within {indicator}, {location} emitted {totalEmissions}<b>/year</b>, and removed {totalRemovals}<b>/year</b>. This represents a {netCarbonFluxWording} of {totalFlux}<b>/year</b>.',
  },
  customComponent: 'CarbonFlux',
  settings: {
    threshold: 30,
    includesGainPixels: true,
    startYear: 2001,
    endYear: 2023,
    sentence: {
      netCarbonFlux: {
        positive: 'net carbon source',
        negative: 'net carbon sink',
        neutral: 'net carbon flux',
      },
    },
  },
  whitelists: {},
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
      return getCarbonFlux(params).then((flux) => {
        if (!flux || !flux.length) return [];
        return flux;
      });
    }
    // use OTF
    const geostoreId = params?.geostore?.hash || params?.geostore?.id;
    return getCarbonFluxOTF({
      ...params,
      geostoreId,
      staticStatement: {
        // overrides tables and/or sql
        table: 'gfw_forest_carbon_net_flux',
      },
    }).then((flux) => {
      if (!flux || !flux.length) return [];
      return flux;
    });
  },
  getDataURL: (params) => [getCarbonFlux({ ...params, download: true })],
  getWidgetProps,
};
