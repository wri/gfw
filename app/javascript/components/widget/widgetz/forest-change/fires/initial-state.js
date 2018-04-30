export default {
  title: 'Fires',
  config: {
    size: 'small',
    categories: ['forest-change', 'summary'],
    admins: ['country', 'region', 'subRegion'],
    metaKey: 'widget_fire_alert_location',
    layers: ['viirs_fires_alerts'],
    type: 'fires',
    sentences: {
      initial:
        'In {location} there were {count} active fires detected in the last 7 days.'
    }
  },
  settings: {
    period: 'week',
    periodValue: 1,
    layers: ['viirs_fires_alerts']
  },
  enabled: true
};
