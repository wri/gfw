import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setNews = (state, { payload }) => ({
  ...state,
  data: payload
});

const setNewsLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setNews]: setNews,
  [actions.setNewsLoading]: setNewsLoading
};
