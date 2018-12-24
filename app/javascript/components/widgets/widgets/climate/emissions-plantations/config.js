export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Emissions loss in plantations vs. natural forest',
    initial: 'Emissions loss in {location}'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  colors: 'extent',
  metaKey: 'widget_ifl',
  layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
  sortOrder: {
    landCover: 3
  },
  sentences: {
    initial:
      'From start_yr to stop_yr, plantations_per% of tree cover loss in {location} occurred within plantations. The total loss within natural forest was equivalent to admin_emissionst of CO2 emissions.',
    withIndicator:
      'As of 2013, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2013, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2013, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
  }
};
