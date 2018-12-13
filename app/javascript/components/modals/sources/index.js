import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

import sources from './config';

const mapStateToProps = ({ modalSources }) => ({
  open: modalSources.open,
  data: sources[modalSources.source] || {}
});

reducerRegistry.registerModule('modalSources', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(Component);
