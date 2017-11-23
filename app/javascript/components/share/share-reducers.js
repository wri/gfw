export const initialState = {
  isOpen: false,
  data: {},
  url: ''
};

const setShareModal = (state, { payload }) => ({
  ...state,
  isOpen: payload.isOpen !== undefined ? payload.isOpen : state.isOpen,
  data: payload.data !== undefined ? payload.data : state.data
});

const setShareUrl = (state, { payload }) => ({
  ...state,
  url: payload
});

export default {
  setShareModal,
  setShareUrl
};
