import { createSelector, createStructuredSelector } from 'reselect';

import { initialState } from './reducers';

const selectSubscribeUrlState = state =>
  state.location && state.location.query && state.location.query.subscribe;
const selectUserData = state => (state.myGfw && state.myGfw.data) || {};
const selectLoading = state =>
  (state.datasets && state.datasets.loading) ||
  (state.myGfw && state.myGfw.loading);
const selectSaving = state =>
  state.subscriptionForm && state.subscriptionForm.saving;
const selectSaved = state =>
  state.subscriptionForm && state.subscriptionForm.saved;
const selectError = state =>
  state.subscriptionForm && state.subscriptionForm.error;
const selectCountries = state =>
  state.countryData && state.countryData.countries;

export const getSubscribeSettings = createSelector(
  [selectSubscribeUrlState],
  urlState => ({
    ...initialState,
    ...urlState
  })
);

export const getName = createSelector(
  [getSubscribeSettings],
  settings => settings.name
);

export const getEmail = createSelector(
  [selectUserData],
  settings => settings.email
);

export const getSubscriptionFormProps = createStructuredSelector({
  name: getName,
  email: getEmail,
  loading: selectLoading,
  userData: selectUserData,
  saving: selectSaving,
  saved: selectSaved,
  error: selectError,
  countries: selectCountries
});
