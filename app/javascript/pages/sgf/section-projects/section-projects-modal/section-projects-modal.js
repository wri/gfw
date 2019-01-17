import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './section-projects-modal-actions';
import reducers, { initialState } from './section-projects-modal-reducers';

import SectionProjectsModalComponent from './section-projects-modal-component';

const mapStateToProps = state => ({
  isOpen: state.modalSGF && state.modalSGF.isOpen,
  data: state.modalSGF && state.modalSGF.data
});

reducerRegistry.registerModule('modalSGF', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(SectionProjectsModalComponent);
