import * as ParentWidget from '../tree-cover';

import childConfig from './config';
import childSettings from './settings';

const Component = ParentWidget.Component;
const parentConfig = ParentWidget.config;
const parentSettings = ParentWidget.settings;
const getData = ParentWidget.getData;
const getProps = ParentWidget.getProps;

const config = {
  ...parentConfig,
  ...childConfig
};

const settings = {
  ...parentSettings,
  ...childSettings
};

export { getData, getProps, Component, config, settings };
