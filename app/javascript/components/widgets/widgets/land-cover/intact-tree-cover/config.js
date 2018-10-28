export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}'
  },
  categories: ['land-cover'],
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
      'As of 2013, {percentage} of {location} tree cover was <b>intact forest</b>.',
    withIndicator:
      'As of 2013, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2013, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2013, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
  }
};
