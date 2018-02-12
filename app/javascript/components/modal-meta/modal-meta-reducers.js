export const initialState = {
  loading: false,
  error: false,
  open: false,
  closing: false,
  data: {}
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
  ...state,
  ...payload
});

export default {
  setModalMetaData,
  setModalMetaClosing,
  setModalMetaLoading
};
