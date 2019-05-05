import { connect } from 'react-redux';

import { clearAnalysisError } from 'components/maps/components/analysis/actions';
import { setMainMapSettings } from 'components/maps/main-map/actions';
import { setMapSettings } from 'components/maps/map/actions';
import { getDataAnalysisMenuProps } from './selectors';
import Component from './component';

export default connect(getDataAnalysisMenuProps, {
  clearAnalysisError,
  setMainMapSettings,
  setMapSettings
})(Component);
