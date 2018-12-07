import { connect } from 'react-redux';

import { clearAnalysisError } from 'components/maps/components/analysis/actions';
import { setMainMapSettings } from 'components/maps/main-map/actions';
import { getDataAnalysisMenuProps } from './selectors';
import Component from './component';

export default connect(getDataAnalysisMenuProps, {
  clearAnalysisError,
  setMainMapSettings
})(Component);
