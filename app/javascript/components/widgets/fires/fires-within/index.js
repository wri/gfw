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
  title: {
    default: 'Fires alerts in {location} {indicator}',
    global: 'Global Fires alerts in {indicator}'
  },
  categories: ['fires'],
  types: ['global', 'country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  potato: true,
  settingsConfig: [
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
      clearable: true,
      border: true
    },
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [1, 2, 4, 8, 13, 26, 52],
      noSort: true,
      border: true
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
      options: [{ label: 'All', value: '' }, { label: 'High', value: 'h' }]
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
    fires: 1
  },
  settings: {
    period: 'week',
    weeks: 13,
    dataset: 'viirs',
    confidence: 'h',
    landCategory: '',
    forestType: '',
    showSettingsBtn: true
  },
  refetchKeys: ['weeks', 'confidence', 'landCategory', 'forestType'],
  sentences: {
    noIndicator:
      'In the last {timeframe}, there were {totalFires} fires alerts detected in {location}.',
    globalNoIndicator:
      'In the last {timeframe}, there were {totalFires} fires alerts detected {location}.',
    withInd:
      'In the last {timeframe}, {firesWithinPerc} of all fires alerts detected in {location} ocurred within {indicator}.',
    globalWithInd:
      'In the last {timeframe}, {firesWithinPerc} of all fires alerts detected {location} ocurred within {indicator}.'
  },
  whitelists: {
    checkStatus: true
  },
  getData: params =>
    all([
      fetchVIIRSLatest(params),
      fetchFiresWithin(params),
      fetchFiresWithin({ ...params, forestType: '', landCategory: '' })
    ]).then(
      spread((latest, firesWithin, allFires) => {
        const fireIn = firesWithin.data && firesWithin.data.data;
        const allFire = allFires.data && allFires.data.data;
        let data = {};
        if (Array.isArray(fireIn) && Array.isArray(allFire)) {
          data = {
            latest,
            fireCountIn: fireIn,
            fireCountAll: allFire
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
