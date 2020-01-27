import Component from 'components/widgets/components/widget-sankey';
import { getData, getDataURL } from './actions';
import getProps, { parsePayload } from './selectors';
import config from './config';
import settings from './settings';

export {
  getData,
  getDataURL,
  getProps,
  parsePayload,
  Component,
  config,
  settings
};
