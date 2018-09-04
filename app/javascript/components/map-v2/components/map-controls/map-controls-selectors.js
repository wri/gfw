import { createStructuredSelector } from 'reselect';

import {
  getRecentImagerySettings,
  getMapSettings
} from 'components/map-v2/components/recent-imagery/recent-imagery-selectors';

export const getMapControlsProps = createStructuredSelector({
  settings: getMapSettings,
  recentSettings: getRecentImagerySettings
});
