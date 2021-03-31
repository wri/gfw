import sortBy from 'lodash/sortBy';

import { getLoss } from 'services/analysis-cached';

import OTFAnalysis from 'services/otf-analysis';

import biomassLossIsos from 'data/biomass-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  BIOMASS_LOSS_DATASET,
} from 'data/datasets';

import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  BIOMASS_LOSS,
} from 'data/layers';

import {
  TREE_COVER_LOSS_YEAR,
  BIOMASS_LOSS as BIOMASS_LOSS_v2,
} from 'data/layers-v2';

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';
import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2020;

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
  widget: 'emissionsDeforestation',
  title: 'Emissions from biomass loss in {location}',
  categories: ['climate'],
  types: ['country', 'geostore', 'aoi', 'use', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['co2LossByYear', 'biomassLoss'],
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
      dataset: BIOMASS_LOSS_DATASET,
      layers: [BIOMASS_LOSS],
    },
  ],
  pendingKeys: ['threshold', 'unit'],
  refetchKeys: ['threshold'],
  visible: ['dashboard', 'analysis'],
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'climate',
  sortOrder: {
    climate: 2,
  },
  sentences:
    'Between {startYear} and {endYear}, a total of {value} of {type} was released into the atmosphere as a result of tree cover loss in {location}. This is equivalent to {annualAvg} per year.',
  settings: {
    unit: 'co2LossByYear',
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
  },
  whitelists: {
    adm0: biomassLossIsos,
  },
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
      return getLoss(params).then((response) => {
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
  getDataURL: (params) => [getLoss({ ...params, download: true })],
  getWidgetProps,
};
