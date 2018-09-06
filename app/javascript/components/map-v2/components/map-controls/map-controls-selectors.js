import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getRecentImageryLoading,
  getMapSettings
} from 'components/map-v2/components/recent-imagery/recent-imagery-selectors';

export const getMapControlsProps = createStructuredSelector({
  recentLoading: getRecentImageryLoading,
  settings: getMapSettings,
  recentSettings: getRecentImagerySettings
});
