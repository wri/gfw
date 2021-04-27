import sortBy from 'lodash/sortBy';

import { getEmissions } from 'services/analysis-cached';

import OTFAnalysis from 'services/otf-analysis';

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

import {
  TREE_COVER_LOSS_YEAR,
  BIOMASS_LOSS as BIOMASS_LOSS_v2,
} from 'data/layers-v2';

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';
import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import treeLoss from 'components/widgets/forest-change/tree-loss';
import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2020;

// To do
const getOTFAnalysis = async (params) => {
  const analysis = new OTFAnalysis(params.geostore.id);
  analysis.setData(['emissionsDeforestation', 'biomassLoss'], {
    ...params,
    extentYear: 2000,
  });

  const { startYear, endYear, range } = getYearsRangeFromMinMax(
    MIN_YEAR,
    MAX_YEAR
  );

  return analysis.getData().then((response) => {
    const { emissionsDeforestation, biomassLoss } = response;

    const loss = sortBy(
      emissionsDeforestation.data.map((d, index) => ({
        biomassLoss: biomassLoss?.data[index][BIOMASS_LOSS_v2],
        emissions: d.whrc_aboveground_co2_emissions__Mg,
        year: d.umd_tree_cover_loss__year,
      })),
      TREE_COVER_LOSS_YEAR
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
};

export default {
  ...treeLoss,
  widget: 'emissionsDeforestation',
  title: 'Forest-related greenhouse gas emissions in {location}',
  large: true,
  categories: ['climate'],
  types: ['country', 'geostore', 'aoi', 'use', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  settingsConfig: [
    {
      key: 'emissionType',
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
  visible: ['dashboard', 'analysis'],
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'climate',
  sortOrder: {
    climate: 1,
  },
  sentences: {
    initial:
      'Between {startYear} and {endYear}, an average of {annualAvg} per year was released into the atmosphere as a result of tree cover loss in {location}. In total, {value} was emitted in this period',
    co2Only: ', considering emissions from CO\u2082 only.',
    nonCo2Only: ', considering emissions from non-CO\u2082 gases only.',
  },
  settings: {
    emissionType: 'emissionsAll',
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
  },
  whitelists: {
    adm0: biomassLossIsos,
  },
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
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
    }
    return getOTFAnalysis(params);
  },
  getDataURL: (params) => [getEmissions({ ...params, download: true })],
  getWidgetProps,
};
