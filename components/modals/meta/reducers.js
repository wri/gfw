import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  closing: false,
  data: {},
  metakey: '',
  metaType: undefined,
};

const setModalMetaLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setModalMetaSettings = (state, { payload }) => {
  const settings =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? { metakey: payload.metakey, metaType: payload.metaType }
      : { metakey: payload, metaType: undefined };

  return {
    ...state,
    ...settings,
  };
};

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
