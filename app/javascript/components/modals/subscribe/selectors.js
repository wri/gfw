import { createSelector, createStructuredSelector } from 'reselect';

import { getFullLocationName } from 'components/map-v2/components/analysis/components/draw-analysis/selectors';
import initialState from './initial-state';

const selectSubscribeUrlState = state =>
  state.location && state.location.query && state.location.query.subscribe;
const selectUserData = state => state.myGfw.data;
const selectLoading = state => state.datasets.loading || state.myGfw.loading;
const selectDatasets = state => state.datasets.datasets;

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

export const getActiveDatasets = createSelector(
  [getSubscribeSettings],
  settings => settings.datasets
);

export const getSubscriptionDatasets = createSelector(
  [selectDatasets, getActiveDatasets],
  (datasets, activeDatasets) =>
    datasets &&
    datasets.filter(d => d.subscriptionKey).map(d => ({
      ...d,
      active: activeDatasets.includes(d.id)
    }))
);

export const getModalSubscribeProps = createStructuredSelector({
  open: getOpen,
  name: getName,
  lang: getLang,
  email: getEmail,
  loading: selectLoading,
  userData: selectUserData,
  datasets: getSubscriptionDatasets,
  activeDatasets: getActiveDatasets,
  locationName: getFullLocationName
});
