import Component from 'components/widgets/components/widget-sankey';
import getData, { getDownloadLink } from './actions';
import getProps, { parsePayload } from './selectors';
import config from './config';
import settings from './settings';

export {
  getData,
  getDownloadLink,
  getProps,
  parsePayload,
  Component,
  config,
  settings
};
