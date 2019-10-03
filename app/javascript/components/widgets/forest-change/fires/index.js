import { fetchViirsAlerts, fetchFiresStats } from 'services/alerts';
import moment from 'moment';

import getWidgetProps from './selectors';

export default {
  widget: 'fires',
  title: 'Fires in {location}',
  categories: ['forest-change', 'summary'],
  admins: ['adm0', 'adm1', 'adm2'],
  types: ['country', 'geostore'],
  metaKey: 'widget_fire_alert_location',
  layers: ['viirs_fires_alerts'],
  type: 'fires',
  colors: 'fires',
  sortOrder: {
    summary: 7,
    forestChange: 11
  },
  chartType: 'composedChart',
  sentences: {
    initial: '{count} active fires detected in {location} in the last 7 days.'
  },
  settings: {
    period: 'week',
    periodValue: 1
  },
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
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  getData: params => {
    const dates = [
      moment().format('YYYY-MM-DD'),
      moment()
        .subtract(params.periodValue, params.period)
        .format('YYYY-MM-DD')
    ];
    // Viirs response too heavy at adm0 level, and returns error (CARTO).
    // If country, use alternative service and parse data.
    if (params.type === 'country') {
      return fetchFiresStats({ ...params, dates }).then(response => {
        const firesResponse = response.data.data.attributes.value;
        const data = firesResponse.filter(v => v.alerts && v.day).map(el => ({
          type: 'viirs-fires',
          attributes: {
            value: el.alerts,
            day: `${el.day}T00:00:00Z`
          }
        }));

        return data;
      });
    }
    return fetchViirsAlerts({ ...params, dates }).then(
      response => response.data.data
    );
  },
  getWidgetProps
};
