import * as actions from './meta-actions';

export const initialState = {
  loading: false,
  error: false,
  closing: false,
  data: {},
  settings: {
    metakey: ''
  }
};

const setModalMetaLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setModalMetaData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

const setModalMetaClosing = (state, { payload }) => ({
  ...initialState,
  closing: payload
});

export default {
  [actions.setModalMetaData]: setModalMetaData,
  [actions.setModalMetaClosing]: setModalMetaClosing,
  [actions.setModalMetaLoading]: setModalMetaLoading
};
