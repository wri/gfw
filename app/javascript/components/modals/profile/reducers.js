import * as actions from './actions';

export const initialState = {
  saving: false,
  error: false,
  settings: {
    open: false
  }
};

const setProfileSaving = (state, { payload }) => ({
  ...state,
  saving: payload.saving,
  error: payload.error
});

export default {
  [actions.setProfileSaving]: setProfileSaving
};
