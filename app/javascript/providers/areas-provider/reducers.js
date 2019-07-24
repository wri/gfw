import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setAreas = (state, { payload }) => ({
  ...state,
  data: payload
});

const setArea = (state, { payload }) => ({
  ...state,
  data: [...state.data.filter(area => area.id !== payload.id), payload]
});

const setActiveArea = (state, { payload }) => ({
  ...state,
  activeArea: payload
});

const clearActiveArea = state => ({
  ...state,
  activeArea: null
});

const setAreasLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setAreas]: setAreas,
  [actions.setArea]: setArea,
  [actions.setActiveArea]: setActiveArea,
  [actions.clearActiveArea]: clearActiveArea,
  [actions.setAreasLoading]: setAreasLoading
};
