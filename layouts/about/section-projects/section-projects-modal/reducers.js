import * as actions from './actions';

export const initialState = {
  isOpen: false,
  data: {},
};

const setSectionProjectsModal = (state, { payload }) => ({
  ...state,
  isOpen: payload.isOpen !== undefined ? payload.isOpen : state.isOpen,
  data: payload.data !== undefined ? payload.data : state.data,
});

export default {
  [actions.setSectionProjectsModal]: setSectionProjectsModal,
};
