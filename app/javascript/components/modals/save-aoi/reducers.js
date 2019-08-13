import * as actions from './actions';

export const initialState = {
  saving: false,
  error: false,
  settings: {
    open: false,
    activeAreaId: null
  }
};

const setSaveAOISaving = (state, { payload }) => ({
  ...state,
  saving: payload.saving,
  error: payload.error
});

const resetSaveAOI = () => ({
  ...initialState
});

export default {
  [actions.setSaveAOISaving]: setSaveAOISaving,
  [actions.resetSaveAOI]: resetSaveAOI
};
