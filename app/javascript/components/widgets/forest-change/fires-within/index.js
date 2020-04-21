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
  title: 'Fires within {indicator} in {location}',
  categories: ['forest-change'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    },
    {
      key: 'dataset',
      label: 'fires dataset',
      type: 'select'
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
      border: true
    },
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: false,
      border: true
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
  refetchKeys: ['dataset', 'confidence', 'landCategory', 'forestType'],
  sentences: {
    initial: 'Test sentence {location} fires in {indicator}...'
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
      spread((firesWithin, allFires, latest) => {
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
