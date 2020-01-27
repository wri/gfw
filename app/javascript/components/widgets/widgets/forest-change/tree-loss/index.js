import Component from 'components/widgets/components/widget-composed-chart';
import { getData, getDataURL } from './actions';
import getProps, { parsePayload } from './selectors';
import config from './config';
import settings from './settings';

export {
  getData,
  getDataURL,
  getProps,
  Component,
  config,
  settings,
  parsePayload
};
