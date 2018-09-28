import { connect } from 'react-redux';

import Component from './component';

import { setRecentImagerySettings } from '../recent-imagery/recent-imagery-actions';
import { getLayerManagerProps } from './selectors';

export default connect(getLayerManagerProps, { setRecentImagerySettings })(
  Component
);
