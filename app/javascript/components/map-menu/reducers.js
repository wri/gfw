import * as actions from './actions';

export const initialState = {
  selectedCountries: [],
  menuSection: '',
  datasetCategory: '',
  exploreType: 'topics',
  searchType: 'dataset',
  search: '',
  locations: [],
  loading: false
};

const setLocationsData = (state, { payload }) => ({
  ...state,
  locations: payload
});

const setMenuLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setLocationsData]: setLocationsData,
  [actions.setMenuLoading]: setMenuLoading
};
