import * as actions from './actions';

export const initialState = {
  open: false,
};

const setModalPlanetNoticeOpen = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setModalPlanetNoticeOpen]: setModalPlanetNoticeOpen,
};
