import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  closing: false,
  data: {},
  metakey: '',
  metaType: '',
};

const setModalMetaLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setModalMetaSettings = (state, { payload }) => ({
  ...state,
  metakey: (payload && payload.metakey) || '',
  metaType: (payload && payload.metaType) || '',
});

const setModalMetaData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
});

const setModalMetaClosing = (state, { payload }) => ({
  ...initialState,
  closing: payload,
});

export default {
  [actions.setModalMetaSettings]: setModalMetaSettings,
  [actions.setModalMetaData]: setModalMetaData,
  [actions.setModalMetaClosing]: setModalMetaClosing,
  [actions.setModalMetaLoading]: setModalMetaLoading,
};
