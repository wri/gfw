import * as actions from './actions';

export const initialState = {
  open: false,
  data: {
    src: '',
  },
};

const setModalVideoData = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setModalVideoClosed = (state) => ({
  ...state,
  open: false,
});

export default {
  [actions.setModalVideoData]: setModalVideoData,
  [actions.setModalVideoClosed]: setModalVideoClosed,
};
