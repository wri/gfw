import * as ParentWidget from '../tree-loss';
import { getData, getDataURL } from './actions';
import getProps, { parsePayload } from './selectors';
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

export {
  getData,
  getDataURL,
  getProps,
  Component,
  config,
  settings,
  parsePayload
};
