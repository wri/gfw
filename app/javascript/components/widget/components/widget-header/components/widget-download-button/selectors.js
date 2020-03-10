import { createStructuredSelector } from 'reselect';

const getGladAlertsDownloadUrls = state =>
  state.widgets &&
  state.widgets.data &&
  state.widgets.data.gladAlerts &&
  state.widgets.data.gladAlerts.downloadUrls;

export default createStructuredSelector({
  gladAlertsDownloadUrls: getGladAlertsDownloadUrls
});
