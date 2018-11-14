import { connect } from 'react-redux';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

import sources from './config';

const mapStateToProps = ({ modalSources }) => ({
  open: modalSources.open,
  data: sources[modalSources.source] || {}
});

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
