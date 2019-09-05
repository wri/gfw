import treeLoss from 'components/widgets/forest-change/tree-loss';

import getWidgetProps from './selectors';

export default {
  ...treeLoss,
  widget: 'treeLossGlobal',
  title: 'Global Annual Tree cover loss',
  sentence: {
    initial:
      'From {startYear} to {endYear}, there was a total of {loss} of tree cover loss {location}, equivalent to a {percent} decrease in tree cover since {extentYear} and {emissions} of CO\u2082 emissions.',
    withInd:
      'From {startYear} to {endYear}, there was a total of {loss} of tree cover loss {location} within {indicator}, equivalent to a {percent} decrease in tree cover since {extentYear} and {emissions} of CO\u2082 emissions.'
  },
  types: ['global'],
  admins: ['global'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
      border: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      whitelist: ['wdpa'],
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  getWidgetProps
};
