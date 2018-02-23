import { connect } from 'react-redux';

import Component from './section-impacts-component';
import actions from './section-impacts-actions';
import reducers, { initialState } from './section-impacts-reducers';

const mapStateToProps = ({ impacts }) => ({
  data: impacts.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
