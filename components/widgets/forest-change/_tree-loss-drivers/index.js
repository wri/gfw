import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER,
} from 'data/layers';

import { getTreeCoverLossByDriverType } from 'services/analysis-cached';
import { fetchDataMart } from 'services/datamart';
import getWidgetProps from './selectors';

export default {
  widget: 'treeLossTsc',
  title: {
    initial: 'Tree cover loss by dominant driver in {location}',
    global: 'Global tree cover loss by dominant driver',
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
  large: true,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold'],
  dataType: 'loss',
  settingsConfig: [
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'pieChart',
  datasets: [
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
      dataset: TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
      layers: [TREE_COVER_LOSS_BY_DOMINANT_DRIVER],
    },
  ],
  metaKey: 'widget_tsc_drivers',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1,
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2021,
    chartHeight: 230,
    extentYear: 2000,
  },
  sentences: {
    globalInitial:
      '<b>Globally</b> from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    initial:
      'In {location} from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
  },
  whitelists: {
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
    const {
      adm0,
      adm1,
      adm2,
      analysis,
      // eslint-disable-next-line no-unused-vars
      dashboard,
      geostore,
      threshold,
      type,
    } = params;

    const DATASET = 'tree_cover_loss_by_driver';
    // const HARDCODED_GEOSTORE = 'c3833748f6815d31bad47d47f147c0f0';

    let mappedType =  '';

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

    // TODO: depending on type, send either geostore or adm0, adm1 etc
    const response = await fetchDataMart({
      dataset: DATASET,
      geostoreId: geostore?.id,
      type: mappedType,
      //geostoreId: HARDCODED_GEOSTORE,
      //type: 'geostore',
      adm0,
      adm1,
      adm2,
      threshold,
      isDownload: false,
    });

    if (response.data?.status === 'failed') {
      throw new Error(response.data.message);
    }

    return response.data?.result.tree_cover_loss_by_driver.map((item) => ({
      driver_type: item.drivers_type,
      loss_area_ha: item.loss_area_ha,
    }));
  },
  /*
    getTreeCoverLossByDriverType(params).then((response) => {
      const { data } = (response && response.data) || {};

      return data;
    }),
    */
  getDataURL: (params) => [
    getTreeCoverLossByDriverType({ ...params, download: true }),
  ],
  getWidgetProps,
};
