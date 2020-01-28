import tropicalIsos from 'data/tropical-isos.json';

export default {
  // key for url and state
  widget: 'gladAlerts',
  // title for header
  title: 'Deforestation Alerts in {location}',
  // sentences for header
  sentence: {
    initial:
      'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
    withIndicator:
      'There were {count} GLAD alerts reported in {indicator} in the week of the {date}. This was {status} compared to the same week in previous years.'
  },
  // meta key for info button
  metaKey: 'widget_deforestation_graph',
  // full width or not
  large: true,
  // can show on map analysis
  analysis: true,
  // internal category for colors and filters
  colors: 'loss',
  // data source for filtering
  source: 'gadm',
  // data source for filtering
  dataType: 'loss',
  // categories to show widget on
  categories: ['summary', 'forest-change'],
  // types widget is available for
  types: ['country'],
  // levels of that type you can see the widget
  admins: ['adm0', 'adm1', 'adm2'],
  // layers to show on map
  datasets: [
    // GLAD
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  // position
  sortOrder: {
    summary: 6,
    forestChange: 9
  },
  // whitelists for options
  options: {
    weeks: [13, 26, 52]
    // forestTypes: true,
    // landCategories: true
  },
  // custom whitelists for locations
  whitelistType: 'glad',
  whitelists: {
    adm0: tropicalIsos
  }
};
