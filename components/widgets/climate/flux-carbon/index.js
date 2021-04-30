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

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import treeLoss from 'components/widgets/forest-change/tree-loss';
import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2020;

export default {
  ...treeLoss,
  widget: 'fluxCarbon',
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
      'Between {startYear} and {endYear}, forests in {location} emitted {emission} Mt CO2e/year, and removed {removals} MtCO2e/year. This represents a net carbon flux of {flux} GtCO2e/year.',
  },
  settings: {
    gasesIncluded: 'allGases',
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
  },
  whitelists: {
    adm0: biomassLossIsos,
  },
  getData: (params) => {
    return getCarbonFlux(params).then((response) => {
      const flux = response.data.data;
      console.log(flux)
      const { startYear, endYear, range } = getYearsRangeFromMinMax(
        MIN_YEAR,
        MAX_YEAR
      );
      return {
        flux,
        settings: {
          startYear,
          endYear,
          yearsRange: range,
        },
        options: {
          years: range,
        },
      };
    });
  },
  getDataURL: (params) => [getCarbonFlux({ ...params, download: true })],
  getWidgetProps,
};
