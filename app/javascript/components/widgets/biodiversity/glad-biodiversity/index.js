import gladRanked from 'components/widgets/forest-change/glad-ranked';

import { POLITICAL_BOUNDARIES_DATASET } from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES
} from 'data/layers';

export default {
  ...gladRanked,
  widget: 'gladBiodiversity',
  title: 'Deforestation alerts in biodiversity areas in {location}',
  categories: ['biodiversity'],
  settings: {
    landCategory: 'kba',
    period: 'week',
    weeks: 13
  },
  chartType: 'rankedList',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      whitelist: ['kba', 'aze', 'tiger_cl', 'wdpa'],
      placeholder: 'All categories',
      border: true
    },
    {
      key: 'weeks',
      label: 'weeks',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'unit',
      label: 'unit',
      whitelist: ['%', 'ha'],
      type: 'switch'
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  metaKey: 'widget_deforestation_alert_location_biodiversity'
};
