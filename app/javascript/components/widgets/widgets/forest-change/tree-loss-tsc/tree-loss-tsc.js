import * as Widget from '../../forest-change/tree-loss';
import childState from './initial-state';
import { parseData, parseConfig, getSentence } from './selectors';
import { getData } from './actions';

const Component = Widget.Component;
const parentState = Widget.initialState;

const initialState = {
  title: childState.title,
  config: {
    ...parentState.config,
    ...childState.config
  },
  settings: {
    ...parentState.settings,
    ...childState.settings
  },
  enabled: childState.enabled
};

export {
  Component,
  parseData,
  parseConfig,
  getData,
  getSentence,
  initialState
};
