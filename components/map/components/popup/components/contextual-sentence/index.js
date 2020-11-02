import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';
import { setAnalysisSettings } from 'components/analysis/actions';

import Component from './component';
import { getBoundarySentenceProps } from './selectors';

export default connect(getBoundarySentenceProps, {
  setMapSettings,
  setAnalysisSettings,
  setMainMapSettings,
})(Component);
