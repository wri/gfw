import { createStructuredSelector } from 'reselect';

import { getDashboardWidgets } from 'pages/dashboards/selectors';

export const getEmbedDashboardsProps = createStructuredSelector({
  widgets: getDashboardWidgets
});
