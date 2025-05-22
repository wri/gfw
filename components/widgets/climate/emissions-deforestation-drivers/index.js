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

import { fetchDataMart } from 'services/datamart';
import getWidgetProps from './selectors';
import { shouldQueryPrecomputedTables } from '../../utils/helpers';

const MIN_YEAR = 2001;
const MAX_YEAR = 2024;

const DATASET = 'tree_cover_loss_by_driver';

export default {
  ...emissionsDeforestation,
  widget: 'emissionsDeforestationDrivers',
  title:
    'Forest-related greenhouse gas emissions in {location} by dominant driver',
  admins: ['adm0', 'adm1', 'adm2'],
  types: ['country', 'use'],
  settingsConfig: [
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
  metaKey: 'widget_forest_carbon_emissions_by_driver',
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
      'In {location} from {startYear} to {endYear}, an average of {totalEmissions} <b>per year</b> occurred in areas where the dominant drivers of tree cover loss resulted in deforestation',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no emissions</b> in areas where the dominant drivers of tree cover loss resulted in deforestation',
    globalInitial:
      'In {location} from {startYear} to {endYear}, {totalEmissions} <b>per year</b> in areas where the dominant drivers of tree cover loss resulted in deforestation',
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
  /**
   *
   * @param {Object} params
   * @param {String} params.adm0
   * @param {String} params.adm1
   * @param {String} params.adm2
   * @param {boolean} params.analysis true if widget is rendered in map, otherwise false
   * @param {boolean} params.dashboard true if widget is rendered in dashboard, false otherwise
   * @param {Object} params.geostore
   * @param {string} params.geostore.id gesotore id
   * @param {string} params.threshold threshold value
   * @param {string} params.type country, global
   * @returns
   */
  getData: async (params) => {
    const { adm0, adm1, adm2, analysis, geostore, threshold, type } = params;

    let mappedType = '';

    if (analysis) {
      mappedType = 'geostore';
    } else {
      if (type === 'global') {
        mappedType = 'global';
      }

      if (adm0 !== undefined && adm0 !== null) {
        mappedType = 'admin';
      }
    }

    const response = await fetchDataMart({
      dataset: DATASET,
      geostoreId: geostore?.id,
      type:
        analysis && shouldQueryPrecomputedTables(params) ? 'admin' : mappedType, // checking to not send geostore_id when analyizing entire countries (only in map page, analysis: true)
      adm0,
      adm1,
      adm2,
      threshold,
      isDownload: false,
    });

    if (response.data?.status === 'failed') {
      throw new Error(response.data.message);
    }

    const { startYear, endYear, range } = getYearsRangeFromMinMax(
      MIN_YEAR,
      MAX_YEAR
    );

    return {
      emissions: response.data?.result.tree_cover_loss_by_driver.map(
        (item) => ({
          driver_type: item.drivers_type,
          gross_carbon_emissions_Mg: item.gross_carbon_emissions_Mg,
        })
      ),
      settings: {
        startYear,
        endYear,
        yearsRange: range,
      },
      options: {
        years: range,
      },
    };
  },
  getDataURL: async (params) => {
    const { adm0, adm1, adm2, analysis, geostore, threshold, type } = params;
    let mappedType = '';

    if (analysis) {
      mappedType = 'geostore';
    } else {
      if (type === 'global') {
        mappedType = 'global';
      }

      if (adm0 !== undefined && adm0 !== null) {
        mappedType = 'admin';
      }
    }

    const res = await fetchDataMart({
      dataset: DATASET,
      geostoreId: geostore?.id,
      type: mappedType,
      adm0,
      adm1,
      adm2,
      threshold,
      isDownload: true,
    });

    return [
      {
        name: DATASET,
        url: res,
      },
    ];
  },
  getWidgetProps,
};
