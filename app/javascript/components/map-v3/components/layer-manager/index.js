import { connect } from 'react-redux';

import { setMapLoading } from 'components/map-v2/actions';
import Component from './component';

import { setRecentImagerySettings } from '../recent-imagery/recent-imagery-actions';
import { getLayerManagerProps } from './selectors';

export default connect(getLayerManagerProps, {
  setRecentImagerySettings,
  setMapLoading
})(Component);
