import axios from 'axios';
import moment from 'moment';
import { getYearsRange } from 'components/widgets/utils/data';

import treeLoss from 'components/widgets/forest-change/tree-loss';
import { getExtentOld, getLossOld } from 'services/forest-data';

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
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // loss tsc
    {
      dataset: '89755b9f-df05-4e22-a9bc-05217c8eafc8',
      layers: ['fd05bc2c-6ade-408c-862e-7318557dd4fc']
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
  getData: params =>
    axios
      .all([
        getLossOld({ ...params, landCategory: 'tsc' }),
        getExtentOld({ ...params })
      ])
      .then(
        axios.spread((loss, extent) => {
          let data = {};
          if (loss && loss.data && extent && extent.data) {
            data = {
              loss: loss.data.data,
              extent: (loss.data.data && extent.data.data[0].value) || 0
            };
          }

          const { startYear, range } = getYearsRange(data.loss);

          return {
            ...data,
            settings: {
              startYear,
              endYear: 2015
            },
            options: {
              years: range.filter(y => y.value <= 2015)
            }
          };
        })
      ),
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
