import Component from 'components/widgets/components/widget-horizontal-bar-chart';
import { getData } from './actions';
import { parseData, parseConfig, getSentence } from './selectors';
import initialState from './initial-state';

export {
  getData,
  parseData,
  getSentence,
  Component,
  initialState,
  parseConfig
};
