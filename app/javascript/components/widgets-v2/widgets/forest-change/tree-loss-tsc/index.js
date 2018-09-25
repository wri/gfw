import * as ParentWidget from '../tree-loss';
import getData from './actions';
import getProps from './selectors';
import childConfig from './config';
import childSettings from './settings';

const Component = ParentWidget.Component;
const parentConfig = ParentWidget.config;
const parentSettings = ParentWidget.settings;

const config = {
  ...parentConfig,
  ...childConfig
};

const settings = {
  ...parentSettings,
  ...childSettings
};

export { Component, getProps, getData, config, settings };
