export default {
  widget: 'treeGainLocated',
  title: 'Location of tree cover gain in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    forestTypes: true,
    landCategories: true
  },
  colors: 'gain',
  datasets: [
    // gain
    {
      dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
      layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4']
    }
  ],
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
