import { connect } from 'react-redux';

import { setMapLoading } from 'components/maps/map/actions';
import Component from './component';
import { getLayerManagerProps } from './selectors';

export default connect(getLayerManagerProps, {
  setMapLoading
})(Component);
