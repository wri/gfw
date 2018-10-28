import * as ParentWidget from '../../forest-change/glad-ranked';
import childConfig from './config';
import childSettings from './settings';

const Component = ParentWidget.Component;
const getData = ParentWidget.getData;
const getProps = ParentWidget.getProps;
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
