import * as actions from './actions';

export const initialState = {
  open: false,
  source: ''
};

const setModalSources = (state, { payload }) => ({
  ...state,
  open: payload.open,
  source: payload.source || ''
});

export default {
  [actions.setModalSources]: setModalSources
};
