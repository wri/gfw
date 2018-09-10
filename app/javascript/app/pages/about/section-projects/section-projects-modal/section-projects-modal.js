import { connect } from 'react-redux';

import * as actions from './section-projects-modal-actions';
import reducers, { initialState } from './section-projects-modal-reducers';

import SectionProjectsModalComponent from './section-projects-modal-component';

const mapStateToProps = state => ({
  isOpen: state.projectsModal.isOpen,
  data: state.projectsModal.data
});

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsModalComponent);
