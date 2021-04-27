import { getEmissions } from 'services/analysis-cached';

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
  widget: 'emissionsDeforestation',
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
      'Between {startYear} and {endYear}, an average of {annualAvg} per year was released into the atmosphere as a result of tree cover loss in {location}. In total, {value} was emitted in this period',
    co2Only: ', considering emissions from CO\u2082 only.',
    nonCo2Only: ', considering emissions from non-CO\u2082 gases only.',
  },
  settings: {
    gasesIncluded: 'emissionsAll',
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
  },
  whitelists: {
    adm0: biomassLossIsos,
  },
  getData: (params) => {
    return getEmissions(params).then((response) => {
      const loss = response.data.data;
      const { startYear, endYear, range } = getYearsRangeFromMinMax(
        MIN_YEAR,
        MAX_YEAR
      );
      return {
        loss,
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
  getDataURL: (params) => [getEmissions({ ...params, download: true })],
  getWidgetProps,
};
