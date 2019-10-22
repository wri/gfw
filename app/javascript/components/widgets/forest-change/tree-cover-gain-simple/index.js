import { fetchAnalysisEndpoint } from 'services/analysis';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverGainSimple',
  title: 'Tree cover gain in {location}',
  categories: ['summary', 'forest-change'],
  types: ['geostore', 'wdpa', 'use'],
  admins: ['adm0', 'adm1'],
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // gain
    {
      dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
      layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4']
    }
  ],
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7
  },
  sentence: 'There was {gain} tree cover gain in {location} since <b>2000</b>.',
  getData: params =>
    fetchAnalysisEndpoint({
      ...params,
      name: 'umd',
      params,
      slug: 'umd-loss-gain',
      version: 'v1',
      nonAggregate: true
    }).then(response => {
      const { data } = (response && response.data) || {};
      const gain = data && data.attributes.gain;

      return {
        gain
      };
    }),
  getWidgetProps
};
