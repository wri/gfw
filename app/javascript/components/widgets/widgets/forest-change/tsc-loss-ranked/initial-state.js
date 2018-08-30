export const initialState = {
  title: {
    global: 'Global Tree cover loss by Driver',
    withLocation: 'Tree cover loss by driver in {location}'
  },
  config: {
    size: 'small',
    forestTypes: [],
    units: ['ha', '%'],
    categories: ['forest-change'],
    admins: ['global', 'country'],
    selectors: ['thresholds', 'tscDrivers', 'units', 'startYears', 'endYears'],
    yearRange: ['2001', '2015'],
    type: 'loss',
    metaKey: 'tsc_drivers',
    layers: ['loss_by_driver'],
    sortOrder: {
      summary: 5,
      forestChange: 4
    },
    sentences: {
      initial:
        "From {startYear} to {endYear}, {driver} was responsible for {loss} of {location}<b>'s</b> ",
      noLoss:
        'There was no tree cover loss identified in {location} due to {driver}.',
      perm:
        'permanent tree cover loss, equivalent to {globalPercent} of the global total decrease since {extentYear}.',
      permInd:
        'permanent tree cover loss within {indicator}, equivalent to {globalPercent} of the global total decrease since {extentYear}.',
      temp:
        'permanent tree cover loss, equivalent to {globalPercent} of the global total decrease since {extentYear}.',
      tempInd:
        'permanent tree cover loss within {indicator}, equivalent to {globalPercent} of the global total decrease since {extentYear}.'
    }
  },
  settings: {
    threshold: 30,
    tscDriver: 1,
    startYear: 2001,
    endYear: 2015,
    unit: 'ha',
    extentYear: 2000,
    layers: ['loss_by_driver'],
    pageSize: 5,
    page: 0
  },
  enabled: true
};
