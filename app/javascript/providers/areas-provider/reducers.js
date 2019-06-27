import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setAreas = (state, { payload }) => ({
  ...state,
  data: payload
});

const setAreasLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setAreas]: setAreas,
  [actions.setAreasLoading]: setAreasLoading
};
