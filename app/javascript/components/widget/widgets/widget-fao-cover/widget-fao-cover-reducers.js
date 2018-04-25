import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.FAOCover
};

const setFAOCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setFAOCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export default {
  setFAOCoverLoading,
  setFAOCoverData
};
