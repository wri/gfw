import { all, spread } from 'axios';
import moment from 'moment';
import { getYearsRange } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER
} from 'data/layers';

import treeLoss from 'components/widgets/forest-change/tree-loss';
import { getExtent, getLoss } from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  ...treeLoss,
  widget: 'treeLossTsc',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  settingsConfig: [
    {
      key: 'tscDriverGroup',
      label: 'drivers',
      type: 'select'
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'composedChart',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // loss tsc
    {
      dataset: TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
      layers: [TREE_COVER_LOSS_BY_DOMINANT_DRIVER]
    }
  ],
  metaKey: 'widget_tsc_drivers',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  settings: {
    tscDriverGroup: 'all',
    highlighted: false,
    extentYear: 2000,
    threshold: 30
  },
  sentences: {
    initial:
      'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no</b> tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    globalInitial:
      '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.'
  },
  whitelists: {
    checkStatus: true
  },
  getData: params =>
    all([
      getLoss({ ...params, landCategory: 'tsc', tsc: true }),
      getExtent({ ...params })
    ]).then(
      spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data.filter(d => d.tcs_driver__type !== 'Unknown'),
            extent: (loss.data.data && extent.data.data[0].value) || 0
          };
        }

        const { startYear, endYear, range } = getYearsRange(data.loss);

        return {
          ...data,
          settings: {
            startYear,
            endYear
          },
          options: {
            years: range.filter(y => y.value <= 2018)
          }
        };
      })
    ),
  getDataURL: params => [
    getLoss({ ...params, forestType: 'tsc', tsc: true, download: true }),
    getExtent({ ...params, download: true })
  ],
  getWidgetProps,
  parseInteraction: payload => {
    if (payload) {
      const year = payload.year;
      return {
        updateLayer: true,
        startDate:
          year &&
          moment()
            .year(year)
            .startOf('year')
            .format('YYYY-MM-DD'),
        endDate:
          year &&
          moment()
            .year(year)
            .endOf('year')
            .format('YYYY-MM-DD')
      };
    }

    return {};
  }
};
