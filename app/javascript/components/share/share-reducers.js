export const initialState = {
  isOpen: false,
  haveEmbed: false,
  selectedType: 'link',
  url: '',
  embedSettings: {
    width: 600,
    height: 600
  },
  data: {}
};

const setShareModal = (state, { payload }) => ({
  ...state,
  isOpen: payload.isOpen,
  haveEmbed:
    payload.haveEmbed !== undefined ? payload.haveEmbed : state.haveEmbed,
  embedSettings:
    payload.embedSettings !== undefined
      ? payload.embedSettings
      : state.embedSettings,
  data: payload.data !== undefined ? payload.data : state.data
});

const setShareUrl = (state, { payload }) => ({
  ...state,
  url: payload
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
