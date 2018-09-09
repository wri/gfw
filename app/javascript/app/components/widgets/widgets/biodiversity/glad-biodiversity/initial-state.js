export default {
  title: {
    withLocation: 'Deforestation Alerts in Biodiversity Areas in {location}'
  },
  config: {
    landCategories: ['kba', 'aze', 'tiger_cl', 'wdpa'],
    categories: ['biodiversity'],
    selectors: [
      'landCategories',
      'weeks',
      'extentYears',
      'units',
      'thresholds'
    ],
    metaKey: 'widget_deforestation_alert_location_biodiversity'
  },
  settings: {
    landCategory: 'kba',
    clearable: false
  },
  enabled: true
};
