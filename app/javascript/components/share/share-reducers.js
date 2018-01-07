export const initialState = {
  loading: false,
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
  loading: true,
  data: {
    ...state.data,
    ...payload
  }
});

const setShareSelected = (state, { payload }) => ({
  ...state,
  selected: payload
});

const setShareUrl = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...state.data,
    shareUrl: payload
  }
});

const setShareOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  setShareData,
  setShareSelected,
  setShareOpen,
  setShareUrl
};
