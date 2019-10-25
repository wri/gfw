import * as actions from './actions';

export const initialState = {
  saving: false,
  saved: false,
  error: false,
  deleted: false,
  settings: {
    open: false,
    activeAreaId: null
  }
};

const setSaveAOISaving = (state, { payload }) => ({
  ...state,
  saving: payload.saving,
  saved: payload.saved,
  error: payload.error,
  deleted: payload.deleted
});

const resetSaveAOI = () => ({
  ...initialState
});

export default {
  [actions.setSaveAOISaving]: setSaveAOISaving,
  [actions.resetSaveAOI]: resetSaveAOI
};
