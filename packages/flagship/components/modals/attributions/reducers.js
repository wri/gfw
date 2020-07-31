import * as actions from './actions';

export const initialState = {
  open: false
};

const setModalAttributions = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setModalAttributions]: setModalAttributions
};
