export default {
  widget: 'treeGainLocated',
  title: 'Location of tree cover gain in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    units: ['ha'],
    forestTypes: true,
    landCategories: true
  },
  colors: 'gain',
  layers: ['forestgain'],
  metaKey: 'widget_tree_cover_gain_location',
  sortOrder: {
    forestChange: 6
  },
  sentences: {
    initial:
      'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most tree cover gain at {value} compared to an average of {average}.',
    withIndicator:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most tree cover gain at {value} compared to an average of {average}.',
    initialPercent:
      'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most relative tree cover gain at {value} compared to an average of {average}.',
    withIndicatorPercent:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most relative tree cover gain at {value} compared to an average of {average}.'
  }
};
