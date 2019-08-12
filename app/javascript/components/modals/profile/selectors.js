import { createSelector, createStructuredSelector } from 'reselect';

import { initialState } from './reducers';

const selectProfileUrlState = state =>
  state.location && state.location.query && state.location.query.profile;
const selectLoading = state =>
  (state.datasets && state.datasets.loading) ||
  (state.myGfw && state.myGfw.loading);
const selectSaving = state => state.profile && state.profile.saving;
const selectError = state => state.profile && state.profile.error;
const selectUserData = state => (state.myGfw && state.myGfw.data) || {};

export const getProfileSettings = createSelector(
  [selectProfileUrlState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getOpen = createSelector(
  [getProfileSettings],
  settings => settings.open
);

export const getModalAOIProps = createStructuredSelector({
  saving: selectSaving,
  loading: selectLoading,
  open: getOpen,
  error: selectError,
  userData: selectUserData
});
