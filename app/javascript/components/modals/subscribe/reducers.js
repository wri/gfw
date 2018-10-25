import * as actions from './actions';

export const initialState = {
  open: false
};

const setModalSubscribe = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setModalSubscribe]: setModalSubscribe
};
