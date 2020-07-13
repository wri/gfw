import * as actions from './actions';

export const initialState = {
  open: false,
  activeAreaId: null,
};

const setAreaOfInterestModalSettings = (state, { payload }) => ({
  ...state,
  ...payload,
});

export default {
  [actions.setAreaOfInterestModalSettings]: setAreaOfInterestModalSettings,
};
