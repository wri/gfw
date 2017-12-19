export const initialState = {
  isOpen: false,
  haveEmbed: false,
  selectedType: 'link',
  data: {}
};

const setShareModal = (state, { payload }) => ({
  ...state,
  isOpen: payload.isOpen,
  haveEmbed:
    payload.haveEmbed !== undefined ? payload.haveEmbed : state.haveEmbed,
  data: payload.data !== undefined ? payload.data : state.data
});

const setShareUrl = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    url: payload
  }
});

const setShareType = (state, { payload }) => ({
  ...state,
  selectedType: payload
});

export default {
  setShareModal,
  setShareUrl,
  setShareType
};
