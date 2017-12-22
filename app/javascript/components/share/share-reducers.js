export const initialState = {
  isOpen: false,
  haveEmbed: false,
  selectedType: 'link',
  data: {
    title: '',
    url: '',
    embedUrl: '',
    embedSettings: { width: 0, height: 0 }
  }
};

const setShareData = (state, { payload }) => ({
  ...state,
  isOpen: payload.isOpen,
  haveEmbed:
    payload.haveEmbed !== undefined ? payload.haveEmbed : state.haveEmbed,
  data: payload.data !== undefined ? payload.data : state.data
});

const setShareType = (state, { payload }) => ({
  ...state,
  selectedType: payload
});

const setIsOpen = (state, { payload }) => ({
  ...state,
  isOpen: payload
});

export default {
  setShareData,
  setShareType,
  setIsOpen
};
