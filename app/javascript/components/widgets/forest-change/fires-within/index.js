import { fetchFiresWithin, fetchVIIRSLatest } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FIRES_VIIRS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FIRES_ALERTS_VIIRS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'firesWithin',
  title: 'Fires alerts in {location} {indicator}',
  categories: ['forest-change'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [1, 13, 26, 52],
      noSort: true,
      border: true
    },
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: false
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: false,
      border: false
    }
  ],
  dataType: 'fires',
  chartType: 'pieChart',
  colors: 'fires',
  metaKey: '',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: FIRES_VIIRS_DATASET,
      layers: [FIRES_ALERTS_VIIRS]
    }
  ],
  sortOrder: {
    forestChange: -1
  },
  settings: {
    period: 'week',
    weeks: 13,
    dataset: 'VIIRS',
    confidence: 'h',
    landCategory: 'wdpa',
    forestType: ''
  },
  refetchKeys: ['confidence', 'landCategory', 'forestType'],
  sentences: {
    withInd:
      'In the last {timeframe}, {perfireswithin} of all fires alerts detected in {location} ocurred within {indicator}.'
  },
  whitelists: {
    checkStatus: true
  },
  getData: params =>
    all([
      fetchFiresWithin(params),
      fetchFiresWithin({ ...params, forestType: '', landCategory: '' }),
      fetchVIIRSLatest(params)
    ]).then(
      spread((firesWithin, allFires) => {
        const fireIn = firesWithin.data && firesWithin.data.data;
        const AllFire = allFires.data && allFires.data.data;
        let data = {};
        if (fireIn.length && AllFire.length) {
          const fireCountIn =
            fireIn[0] && fireIn[0].count ? fireIn[0].count : 0;
          const fireCountAll =
            AllFire[0] && AllFire[0].count ? AllFire[0].count : 0;

          data = {
            fireCountIn,
            fireCountAll
          };
        }
        return data;
      })
    ),
  getDataURL: params => [
    fetchFiresWithin({ ...params, download: true }),
    fetchFiresWithin({
      ...params,
      forestType: '',
      landCategory: '',
      download: true
    })
  ],
  getWidgetProps
};
