import * as actions from './basemaps-actions';

export const initialState = {
  loading: false,
  error: false,
  data: {
    planet: []
  }
};

const setBasemapsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setBasemapsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false,
  error: false
});

export default {
  [actions.setBasemapsLoading]: setBasemapsLoading,
  [actions.setBasemapsData]: setBasemapsData
};
