import treeLoss from 'components/widgets/forest-change/tree-loss';

import getWidgetProps from './selectors';

export default {
  ...treeLoss,
  widget: 'treeLossFiresAnnual',
  title: {
    default: 'Tree cover loss due to fires in {location}',
    global: 'Global tree cover loss due to fires',
  },
  caution: {
    text:
      'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. {Read more here}.',
    visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
    linkText: 'Read more here',
    link:
      'https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/',
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, there was a total of {loss} of tree cover loss {location}, equivalent to a {percent} decrease in tree cover since {extentYear} and {emissions} of CO\u2082 emissions.',
    withInd:
      'From {startYear} to {endYear}, there was a total of {loss} of tree cover loss {location} within {indicator}, equivalent to a {percent} decrease in tree cover since {extentYear} and {emissions} of CO\u2082 emissions.',
  },
  categories: ['fires'],
  types: ['global'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      whitelist: [],
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  getWidgetProps,
};
