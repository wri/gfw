export default {
  widget: 'treeCoverGain',
  title: {
    global: 'Global Tree cover gain',
    initial: 'Tree cover gain in {location} compared to other areas'
  },
  categories: ['summary', 'forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    forestTypes: ['ifl'],
    landCategories: true
  },
  colors: 'gain',
  metaKey: 'widget_tree_cover_gain',
  layers: ['forestgain'],
  sortOrder: {
    summary: 3,
    forestChange: 7
  },
  sentences: {
    globalInitial:
      'From 2001 to 2012, {gain} of tree cover was gained {location}.',
    globalWithIndicator:
      'From 2001 to 2012, {gain} of tree cover was gained within {indicator} {location}.',
    initial:
      'From 2001 to 2012, {location} gained {gain} of tree cover equal to {gainPercent} of the {parent} total.',
    withIndicator:
      'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of the {parent} total.',
    regionInitial:
      'From 2001 to 2012, {location} gained {gain} of tree cover {indicator} equal to {gainPercent} of all tree cover gain in {parent}.',
    regionWithIndicator:
      'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of all tree cover gain in {parent}.'
  }
};
