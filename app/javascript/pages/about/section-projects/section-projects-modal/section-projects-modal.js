import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './section-projects-modal-actions';
import reducers, { initialState } from './section-projects-modal-reducers';

import SectionProjectsModalComponent from './section-projects-modal-component';

const mapStateToProps = state => ({
  isOpen: state.modalAbout && state.modalAbout.isOpen,
  data: state.modalAbout && state.modalAbout.data
});

reducerRegistry.registerModule('modalAbout', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(SectionProjectsModalComponent);
