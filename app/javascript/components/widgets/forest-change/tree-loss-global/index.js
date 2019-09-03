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
  // options: {
  //   forestTypes: ['ifl'],
  //   landCategories: ['wdpa'],
  //   extentYears: true,
  //   thresholds: true,
  //   startYears: true,
  //   endYears: true
  // },
  getWidgetProps
};
