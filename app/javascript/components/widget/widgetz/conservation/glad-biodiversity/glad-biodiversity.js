import * as Widget from '../../forest-change/glad-ranked';
import childState from './initial-state';

const Component = Widget.Component;
const parseData = Widget.parseData;
const getData = Widget.getData;
const getSentence = Widget.getSentence;
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

export { Component, parseData, getData, getSentence, initialState };
