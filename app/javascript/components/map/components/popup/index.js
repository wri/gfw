import { connect } from 'react-redux';

import { setMainMapAnalysisView } from 'components/maps/main-map/actions';
import { setMapSettings, clearMapInteractions } from 'components/map/actions';
import { getGeostoreId } from 'components/map/components/draw/actions';

import Component from './component';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  setMainMapAnalysisView,
  clearMapInteractions,
  setMapSettings,
  getGeostoreId
};

export default connect(getPopupProps, actions)(Component);
