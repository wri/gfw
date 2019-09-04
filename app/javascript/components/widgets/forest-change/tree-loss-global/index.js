import treeLoss from 'components/widgets/forest-change/tree-loss';

import { getForestTypes, getLandCategories } from 'components/widgets/utils';
import thresholds from 'data/thresholds.json';
import extentYears from 'data/extent-years.json';

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
      options: getForestTypes,
      whitelist: ['ifl'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      options: getLandCategories,
      whitelist: ['wdpa'],
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      options: extentYears,
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
      options: thresholds,
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  getWidgetProps
};
