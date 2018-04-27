export const initialState = {
  title: 'Where did tree cover loss occur',
  config: {
    size: 'small',
    indicators: ['gadm28', 'ifl_2013', 'mining', 'wdpa', 'plantations', 'landmark', 'primary_forest',
      'ifl_2013', 'ifl_2013__wdpa', 'ifl_2013__mining', 'ifl_2013__landmark',
      'primary_forest', 'primary_forest__mining', 'primary_forest__wdpa', 'primary_forest__landmark',
      'plantations__mining', 'plantations__wdpa', 'plantations__landmark'],
    units: ['ha', '%'],
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region'],
    selectors: ['indicators', 'thresholds', 'units', 'startYears', 'endYears', 'extentYears'],
    locationCheck: true,
    type: 'loss',
    layers: ['loss'],
    metaKey: 'widget_tree_cover_loss_location',
    sortOrder: {
      summary: 4,
      forestChange: 2
    },
    sentences: {
      initial: 'In Brazil, the top 10 regions were responsible for more than half (85%) of all tree cover loss between 2001 and 2016. Pará had the largest tree cover loss at 11.2Mha compared to an average of 1.72Mha.',
      withIndicator:
        'As of {year}, {indicator} in {location} had {value} of tree cover.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    extentYear: 2000,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    startYear: 2001,
    endYear: 2016,
    layers: ['loss']
  },
  enabled: true
};
