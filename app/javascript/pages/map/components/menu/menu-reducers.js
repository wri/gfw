import * as actions from './menu-actions';

export const initialState = {
  selectedCountries: [],
  selectedSection: '',
  exploreSection: 'topics',
  search: '',
  locations: [],
  loading: false
};

const setLocationsData = (state, { payload }) => ({
  ...state,
  locations: payload
});

const setLocationsLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setLocationsData]: setLocationsData,
  [actions.setLocationsLoading]: setLocationsLoading
};
