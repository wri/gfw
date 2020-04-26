import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  closing: false,
  data: {},
  settings: {
    metakey: '',
  },
};

const setModalMetaLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setModalMetaData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
});

const setModalMetaSettings = (state, { payload }) => ({
  ...state,
  settings: {
    metakey: payload,
  },
});

const setModalMetaClosing = (state, { payload }) => ({
  ...initialState,
  closing: payload,
});

export default {
  [actions.setModalMetaData]: setModalMetaData,
  [actions.setModalMetaSettings]: setModalMetaSettings,
  [actions.setModalMetaClosing]: setModalMetaClosing,
  [actions.setModalMetaLoading]: setModalMetaLoading,
};
