import { createStructuredSelector } from 'reselect';

import { getWidgets } from 'pages/dashboards/selectors';

export const getEmbedDashboardsProps = createStructuredSelector({
  widgets: getWidgets
});
