import { connect } from 'react-redux';
import * as actions from './section-projects-actions';
import reducers, { initialState } from './section-projects-reducers';
import Component from './section-projects-component';

const mapStateToProps = state => ({
  data: state.projects.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
