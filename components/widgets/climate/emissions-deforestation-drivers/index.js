import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';
import biomassLossIsos from 'data/biomass-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  CARBON_EMISSIONS_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  CARBON_EMISSIONS,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER,
} from 'data/layers';

import emissionsDeforestation from 'components/widgets/climate/emissions-deforestation';
import { getEmissions } from 'services/analysis-cached';

import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2023;

export default {
  ...emissionsDeforestation,
  widget: 'emissionsDeforestationDrivers',
  title:
    'Forest-related greenhouse gas emissions in {location} by dominant driver',
  admins: ['adm0', 'adm1'],
  types: ['country', 'aoi', 'wdpa'],
  settingsConfig: [
    {
      key: 'tscDriverGroup',
      label: 'drivers',
      type: 'select',
    },
    ...emissionsDeforestation.settingsConfig,
  ],
  datasets: [
    // TODO BIOMASS LOSS LAYER
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: CARBON_EMISSIONS_DATASET,
      layers: [CARBON_EMISSIONS],
    },
    // loss tsc
    {
      dataset: TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
      layers: [TREE_COVER_LOSS_BY_DOMINANT_DRIVER],
    },
  ],
  metaKey: 'widget_forest_carbon_emissions_by_driver_v20240308',
  colors: 'climate',
  sortOrder: {
    climate: 3,
  },
  settings: {
    gasesIncluded: 'allGases',
    includesGainPixels: true,
    tscDriverGroup: 'all',
    highlighted: false,
    threshold: 30,
  },
  sentences: {
    initial:
      'In {location} from {startYear} to {endYear}, an average of {totalEmissions} occurred in areas where the dominant drivers of loss resulted in {deforestation}',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no emissions</b> in areas where the dominant drivers of loss resulted in {deforestation}',
    globalInitial:
      'In {location} from {startYear} to {endYear}, {totalEmissions} in areas where the dominant drivers of loss resulted in {deforestation}',
    co2Only: ', considering emissions from CO\u2082 only.',
    nonCo2Only: ', considering only emissions from non-CO\u2082 gases only.',
  },
  whitelists: {
    adm0: biomassLossIsos,
    checkStatus: true,
  },
  getData: (params) =>
    getEmissions({ ...params, landCategory: 'tsc', byDriver: true }).then(
      (emissions) => {
        let data = {};
        if (emissions && emissions.data) {
          data = {
            emissions: emissions.data.data.filter(
              (d) => d.tsc_tree_cover_loss_drivers__driver !== 'Unknown'
            ),
          };
        }
        const { startYear, endYear, range } = getYearsRangeFromMinMax(
          MIN_YEAR,
          MAX_YEAR
        );
        return {
          ...data,
          settings: {
            startYear,
            endYear,
            yearsRange: range,
          },
          options: {
            years: range,
          },
        };
      }
    ),
  getDataURL: (params) => [
    getEmissions({
      ...params,
      landCategory: 'tsc',
      byDriver: true,
      download: true,
    }),
  ],
  getWidgetProps,
};
