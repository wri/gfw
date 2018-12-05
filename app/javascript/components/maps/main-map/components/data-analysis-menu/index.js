import { connect } from 'react-redux';

import { clearAnalysisError } from 'components/maps/components/analysis/actions';
import { setMapMainSettings } from 'components/maps/main-map/actions';

import Component from './component';
import { getDataAnalysisMenuProps } from './selectors';

export default connect(getDataAnalysisMenuProps, {
  clearAnalysisError,
  setMapMainSettings
})(Component);
