import * as actions from './actions';

export const initialState = {
  saving: false,
  error: false,
  open: false,
  saved: false,
  name: '',
  lang: 'en',
  email: '',
  datasets: []
};

const setSubscribeSaving = (state, { payload }) => ({
  ...state,
  ...payload
});

const clearSubscribeError = (state, { payload }) => ({
  ...state,
  error: payload
});

const setSubscribeSaved = (state, { payload }) => ({
  ...state,
  saved: payload
});

export default {
  [actions.setSubscribeSaving]: setSubscribeSaving,
  [actions.setSubscribeSaved]: setSubscribeSaved,
  [actions.clearSubscribeError]: clearSubscribeError
};
