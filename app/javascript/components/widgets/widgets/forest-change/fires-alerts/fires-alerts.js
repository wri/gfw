import Component from 'components/widgets/components/widget-alerts';
import { getData } from './actions';
import { parseData, getSentence, parseConfig } from './selectors';
import initialState from './initial-state';

export {
  getData,
  parseData,
  getSentence,
  Component,
  initialState,
  parseConfig
};
