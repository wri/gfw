export default {
  widget: 'gladBiodiversity',
  title: 'Deforestation alerts in biodiversity areas in {location}',
  categories: ['biodiversity'],
  options: {
    landCategories: ['kba', 'aze', 'tiger_cl', 'wdpa'],
    weeks: true,
    extentYears: true,
    units: ['%', 'ha'],
    thresholds: true
  },
  metaKey: 'widget_deforestation_alert_location_biodiversity'
};
