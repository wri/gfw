import * as actions from './actions';

export const initialState = {
  saving: false,
  error: false,
  email: ''
};

const setSubscribeSaving = (state, { payload }) => ({
  ...state,
  ...payload
});

const clearSubscribeError = (state, { payload }) => ({
  ...state,
  error: payload
});

const resetSubscribe = () => ({
  ...initialState
});

export default {
  [actions.setSubscribeSaving]: setSubscribeSaving,
  [actions.resetSubscribe]: resetSubscribe,
  [actions.clearSubscribeError]: clearSubscribeError
};
