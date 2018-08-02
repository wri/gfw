import { connect } from 'react-redux';

import Component from './component';
import { getLayerSelectorProps } from './selectors';

const mapStateToProps = (state, { layerGroup, layers }) => ({
  ...getLayerSelectorProps({ layerGroup, layers })
});

export default connect(mapStateToProps, null)(Component);
