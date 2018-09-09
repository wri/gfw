import { connect } from 'react-redux';

import actions from './section-projects-modal-actions';
import reducers, { initialState } from './section-projects-modal-reducers';

import SectionProjectsModalComponent from './section-projects-modal-component';

const mapStateToProps = state => ({
  isOpen: state.projectsModal.isOpen,
  data: state.projectsModal.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsModalComponent);
