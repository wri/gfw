import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setPlanetBasemaps = (state, { payload }) => ({
  ...state,
  data: payload
});

const setPlanetBasemapsLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setPlanetBasemaps]: setPlanetBasemaps,
  [actions.setPlanetBasemapsLoading]: setPlanetBasemapsLoading
};
