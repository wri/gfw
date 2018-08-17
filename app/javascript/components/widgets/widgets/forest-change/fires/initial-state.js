export default {
  title: {
    withLocation: 'Fires in {location}'
  },
  config: {
    size: 'small',
    categories: ['forest-change', 'summary'],
    admins: ['country', 'region', 'subRegion'],
    metaKey: 'widget_fire_alert_location',
    layers: ['viirs_fires_alerts'],
    type: 'fires',
    sortOrder: {
      summary: 7,
      forestChange: 11
    },
    sentences: {
      initial: '{count} active fires detected in {location} in the last 7 days.'
    }
  },
  settings: {
    period: 'week',
    periodValue: 1,
    layers: ['viirs_fires_alerts']
  },
  enabled: true
};
