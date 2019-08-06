import * as actions from './actions';

export const initialState = {
  saving: false,
  error: false,
  open: false,
  saved: false,
  name: '',
  lang: 'en',
  email: '',
  datasets: []
};

const setSaveAOISaving = (state, { payload }) => ({
  ...state,
  ...payload
});

const clearSaveAOIError = (state, { payload }) => ({
  ...state,
  error: payload
});

const resetSaveAOI = () => ({
  ...initialState
});

const setSaveAOISaved = state => ({
  ...state,
  saved: true,
  saving: false
});

const setSaveAOIDeleted = state => ({
  ...state,
  deleted: true,
  saving: false
});

export default {
  [actions.setSaveAOISaving]: setSaveAOISaving,
  [actions.setSaveAOISaved]: setSaveAOISaved,
  [actions.setSaveAOIDeleted]: setSaveAOIDeleted,
  [actions.resetSaveAOI]: resetSaveAOI,
  [actions.clearSaveAOIError]: clearSaveAOIError
};
