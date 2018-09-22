import * as ParentWidget from '../tree-loss';
import getProps from './selectors';
import childConfig from './config';

const Component = ParentWidget.Component;
const getData = ParentWidget.getData;
const parentConfig = ParentWidget.config;
const settings = ParentWidget.settings;

const config = {
  ...parentConfig,
  ...childConfig
};

export { Component, getProps, getData, config, settings };
