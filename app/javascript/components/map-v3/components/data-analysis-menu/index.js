import { connect } from 'react-redux';

import * as actions from 'components/map-v2/components/analysis/actions';

import Component from './component';
import { getDataAnalysisMenuProps } from './selectors';

export default connect(getDataAnalysisMenuProps, actions)(Component);
