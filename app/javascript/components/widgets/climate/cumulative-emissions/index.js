import Component from 'components/widgets/components/widget-composed-chart';
import getData from './actions';
import getProps, { getDataOptions, parsePayload } from './selectors';
import config from './config';
import settings from './settings';

export {
  getData,
  getProps,
  getDataOptions,
  parsePayload,
  Component,
  config,
  settings
};
