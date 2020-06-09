import gladRanked from 'components/widgets/forest-change/glad-ranked';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS
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
  chartType: 'lollipop',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
      layers: [GLAD_ALERTS]
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
