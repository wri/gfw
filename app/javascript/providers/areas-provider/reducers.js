import findIndex from 'lodash/findIndex';
import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setAreas = (state, { payload }) => ({
  ...state,
  data: payload
});

const setArea = (state, { payload }) => {
  const { data: areas } = state;
  const index = findIndex(areas, ['id', payload.id]);
  const data = [...areas];
  if (index > -1) {
    data.splice(index, 1, payload); // substitution
  } else {
    data.push(payload); // addition
  }
  return {
    ...state,
    data
  };
};

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
