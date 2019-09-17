import gladRanked from 'components/widgets/forest-change/glad-ranked';

export default {
  ...gladRanked,
  widget: 'gladBiodiversity',
  title: 'Deforestation Alerts in Biodiversity Areas in {location}',
  categories: ['biodiversity'],
  options: {
    landCategories: ['kba', 'aze', 'tiger_cl', 'wdpa'],
    weeks: true,
    extentYears: true,
    units: ['%', 'ha'],
    thresholds: true
  },
  settings: {
    landCategory: 'kba',
    period: 'week',
    weeks: 13
  },
  chartType: 'rankedList',
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
