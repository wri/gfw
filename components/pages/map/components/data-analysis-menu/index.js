import { connect } from 'react-redux';

import { clearAnalysisError } from 'components/analysis/actions';
import { setMainMapSettings } from 'components/pagesmap/actions';
import { setMapSettings } from 'components/map/actions';

import { getDataAnalysisMenuProps } from './selectors';
import Component from './component';

export default connect(getDataAnalysisMenuProps, {
  clearAnalysisError,
  setMainMapSettings,
  setMapSettings
})(Component);
