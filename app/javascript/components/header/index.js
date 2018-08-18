import { connect } from 'react-redux';

import actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ header }) => ({
  ...header
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
