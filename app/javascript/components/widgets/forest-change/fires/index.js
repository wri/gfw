import { fetchFireAlertsByGeostore } from 'services/alerts';

import {
  POLITICAL_BOUNDARIES_DATASET
} from 'data/layers-datasets';
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
  visible: ['analysis'],
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
      dataset: '1d3ccf9b-102e-4c0b-b2ea-2abcc712e194',
      layers: ['93e33932-3959-4201-b8c8-6ec0b32596e0']
    }
  ],
  getData: params =>
    fetchFireAlertsByGeostore(params).then(response => ({
      fires: response.data.data.attributes.value
    })),
  getWidgetProps
};
