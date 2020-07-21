import * as actions from './actions';

export const initialState = {
  open: false,
  activeAreaId: null,
};

const setConfirmSubscriptionModalSettings = (state, { payload }) => ({
  ...state,
  ...payload,
});

export default {
  [actions.setConfirmSubscriptionModalSettings]: setConfirmSubscriptionModalSettings,
};
