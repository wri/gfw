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
  admins: ['adm0', 'adm1', 'adm2'],
  types: ['geostore', 'country', 'aoi', 'use', 'wdpa'],
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
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      whitelist: [30, 50, 75],
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'pieChart',
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
  getChartSettings: (params) => {
    const { dashboard, embed } = params;

    return {
      ...((dashboard || embed) && {
        size: 'small',
        chart: {
          style: {
            display: 'flex',
            height: 'auto',
            alignItems: 'center',
          },
        },
      }),
      groupedLegends: true,
    };
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
