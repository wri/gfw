import { createSelector, createStructuredSelector } from 'reselect';

import { getFullLocationName } from 'components/map-v2/components/analysis/components/draw-analysis/selectors';
import { getActiveDatasetIds } from 'components/map-v2/selectors';
import { initialState } from './reducers';

const selectSubscribeUrlState = state =>
  state.location && state.location.query && state.location.query.subscribe;
const selectUserData = state => state.myGfw.data;
const selectLoading = state => state.datasets.loading || state.myGfw.loading;
const selectDatasets = state => state.datasets.data;
const selectSaving = state => state.modalSubscribe.saving;
const selectSaved = state => state.modalSubscribe.saved;
const selectError = state => state.modalSubscribe.error;
const selectLocation = state => state.location && state.location.payload;

export const getSubscribeSettings = createSelector(
  [selectSubscribeUrlState],
  urlState => ({
    ...initialState,
    ...urlState
  })
);

export const getOpen = createSelector(
  [getSubscribeSettings],
  settings => settings.open
);

export const getName = createSelector(
  [getSubscribeSettings],
  settings => settings.name
);

export const getLang = createSelector(
  [getSubscribeSettings],
  settings => settings.lang
);

export const getEmail = createSelector(
  [selectUserData],
  settings => settings.email
);

export const getActiveSubscriptionDatasets = createSelector(
  [getSubscribeSettings],
  settings => settings.datasets
);

export const getSubscriptionDatasets = createSelector(
  [selectDatasets, getActiveSubscriptionDatasets],
  (datasets, activeDatasets) =>
    datasets &&
    datasets.filter(d => d.subscriptionKey).map(d => ({
      ...d,
      active: activeDatasets.includes(d.subscriptionKey)
    }))
);

export const getActiveMapDatasets = createSelector(
  [getSubscriptionDatasets, getActiveDatasetIds],
  (datasets, activeDatasetIds) =>
    datasets &&
    activeDatasetIds &&
    datasets
      .filter(d => activeDatasetIds.includes(d.id))
      .map(d => d.subscriptionKey)
);

export const getModalSubscribeProps = createStructuredSelector({
  open: getOpen,
  name: getName,
  lang: getLang,
  email: getEmail,
  loading: selectLoading,
  userData: selectUserData,
  datasets: getSubscriptionDatasets,
  activeMapDatasets: getActiveMapDatasets,
  activeDatasets: getActiveSubscriptionDatasets,
  locationName: getFullLocationName,
  saving: selectSaving,
  saved: selectSaved,
  error: selectError,
  location: selectLocation
});
