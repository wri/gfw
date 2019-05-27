import { connect } from 'react-redux';

import { setMapLoading } from 'components/map/actions';
import { getLayerManagerProps } from './selectors';
import Component from './component';

export default connect(getLayerManagerProps, {
  setMapLoading
})(Component);
