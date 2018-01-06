export const initialState = {
  open: false,
  selected: 'link',
  data: {
    title: '',
    subtitle: '',
    shareUrl: '',
    embedUrl: '',
    embedSettings: { width: 0, height: 0 }
  }
};

const setShareData = (state, { payload }) => ({
  ...state,
  open: true,
  selected: 'link',
  data: {
    ...state.data,
    ...payload
  }
});

const setShareSelected = (state, { payload }) => ({
  ...state,
  selected: payload
});

const setShareOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  setShareData,
  setShareSelected,
  setShareOpen
};
