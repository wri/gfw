import merge from 'lodash/merge';

import * as Widget from '../glad-ranked';
import childState from './initial-state';

const Component = Widget.Component;
const parseData = Widget.parseData;
const getData = Widget.getData;
const getSentence = Widget.getSentence;
const initialState = merge(Widget.initialState, childState);

export { Component, parseData, getData, getSentence, initialState };
