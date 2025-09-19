import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER,
} from 'data/layers';
import { fetchDataMart } from 'services/datamart';
import getWidgetProps from './selectors';
import { shouldQueryPrecomputedTables } from '../../utils/helpers';

const DATASET = 'tree_cover_loss_by_driver';

export default {
  widget: 'treeLossTsc',
  title: {
    initial: 'Tree cover loss by dominant driver in {location}',
    global: 'Global tree cover loss by dominant driver',
  },
  types: ['global', 'country', 'use', 'wdpa', 'aoi', 'geostore'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
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
    endYear: 2024,
    chartHeight: 230,
    extentYear: 2000,
  },
  sentences: {
    globalInitial:
      '<b>Globally</b> from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in deforestation.',
    initial:
      'In {location} from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in deforestation.',
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
      geostore,
      threshold,
      type,
      locationType,
    } = params;

    let mappedType = '';

    if (analysis) {
      mappedType = 'geostore';

      if (type === 'wdpa') {
        mappedType = 'protected_area';
      }
    } else {
      if (type === 'global') {
        mappedType = 'global';
      }

      if (adm0 !== undefined && adm0 !== null) {
        mappedType = 'admin';
      }

      if (type === 'geostore') {
        mappedType = 'geostore';
      }
    }

    let check = false;
    let geostoreId = geostore?.id;

    if (mappedType === 'geostore' && shouldQueryPrecomputedTables(params)) {
      check = true;

      if (locationType === 'aoi' || locationType === 'geostore') {
        check = false;
        geostoreId = adm0;
      }
    }

    const response = await fetchDataMart({
      dataset: DATASET,
      geostoreId,
      type: check ? 'admin' : mappedType, // checking to not send geostore_id when analyizing entire countries (only in map page, analysis: true)
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
  getDataURL: async (params) => {
    const {
      adm0,
      adm1,
      adm2,
      analysis,
      geostore,
      threshold,
      type,
      locationType,
    } = params;
    let mappedType = '';

    // in download, analysis comes undefined whereas in getData it comes as true, therefore I had to re-organize the if validations to account correctly for wdpa
    if (analysis) {
      mappedType = 'geostore';

      if (type === 'wdpa') {
        mappedType = 'protected_area';
      }
    } else {
      if (type === 'global') {
        mappedType = 'global';
      }

      if (adm0 !== undefined && adm0 !== null) {
        mappedType = 'admin';
      }

      if (type === 'wdpa') {
        mappedType = 'protected_area';
      }

      if (type === 'geostore') {
        mappedType = 'geostore';
      }
    }

    let check = false;
    let geostoreId = geostore?.id;

    if (mappedType === 'geostore' && shouldQueryPrecomputedTables(params)) {
      check = true;

      if (locationType === 'aoi' || locationType === 'geostore') {
        check = false;
        geostoreId = adm0;
      }
    }

    const res = await fetchDataMart({
      dataset: DATASET,
      geostoreId,
      type: check ? 'admin' : mappedType, // checking to not send geostore_id when analyizing entire countries (only in map page, analysis: true)
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
