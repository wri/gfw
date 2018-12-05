import { connect } from 'react-redux';

import { setRecentImagerySettings } from 'components/maps/main-map/components/recent-imagery/recent-imagery-actions';
import { setMapLoading } from 'components/map-v2/actions';

import Component from './component';
import { getLayerManagerProps } from './selectors';

export default connect(getLayerManagerProps, {
  setRecentImagerySettings,
  setMapLoading
})(Component);
