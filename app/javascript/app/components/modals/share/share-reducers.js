export const initialState = {
  loading: false,
  open: false,
  selected: 'link',
  copied: false,
  data: {
    title: '',
    subtitle: '',
    shareUrl: '',
    embedUrl: '',
    embedSettings: { width: 0, height: 0 },
    socialText: ''
  }
};

const setShareData = (state, { payload }) => ({
  ...state,
  open: true,
  selected: 'link',
  loading: true,
  data: {
    ...payload
  }
});

const setShareSelected = (state, { payload }) => ({
  ...state,
  selected: payload,
  copied: false
});

const setShareCopied = (state, { payload }) => ({
  ...state,
  copied: payload
});

const setShareLoading = (state, { payload }) => ({
  ...state,
  loading: payload
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
  open: payload,
  copied: false
});

export default {
  setShareData,
  setShareSelected,
  setShareOpen,
  setShareUrl,
  setShareCopied,
  setShareLoading
};
