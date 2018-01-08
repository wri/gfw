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
  selected: payload,
  copied: false
});

const setShareCopied = state => ({
  ...state,
  copied: true
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
