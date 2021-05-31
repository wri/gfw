import { connect } from 'react-redux';

import { getBasemapProps } from './selectors';

import Component from './component';

export default connect(getBasemapProps, {})(Component);
