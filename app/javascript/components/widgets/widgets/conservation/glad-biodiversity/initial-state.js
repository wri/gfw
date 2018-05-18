export default {
  title: 'Deforestation Alerts in Biodiversity Areas',
  config: {
    landCategories: ['kba', 'aze', 'wdpa'],
    categories: ['conservation'],
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
