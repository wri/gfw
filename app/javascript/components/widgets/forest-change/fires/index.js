import { fetchFireAlertsByGeostore } from 'services/alerts';

import { POLITICAL_BOUNDARIES_DATASET } from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'fires',
  title: 'Fires in {location}',
  categories: ['forest-change', 'summary'],
  admins: ['adm0', 'adm1', 'adm2'],
  types: ['geostore', 'wdpa', 'use'],
  metaKey: 'widget_fire_alert_location',
  type: 'fires',
  colors: 'fires',
  sortOrder: {
    summary: 7,
    forestChange: 11
  },
  visible: ['dashboard', 'analysis'],
  chartType: 'listLegend',
  sentences: {
    initial: '{count} active fires detected in {location} in the last 7 days.'
  },
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: '0f0ea013-20ac-4f4b-af56-c57e99f39e08',
      layers: ['5371d0c0-4e5f-45f7-9ff2-fe538914f7a3']
    }
  ],
  getData: params =>
    fetchFireAlertsByGeostore(params).then(response => ({
      fires: response.data.data.attributes.value
    })),
  getWidgetProps
};
