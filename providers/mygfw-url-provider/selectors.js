import { createSelector, createStructuredSelector } from 'reselect';

import { initialState as areaOfInterestModalInitialState } from 'components/modals/area-of-interest/reducers';

import { objDiff } from 'utils/data';

export const selectAOIModalSettings = (state) => state.areaOfInterestModal;
export const selectProfileModalOpen = (state) => state.profile?.open;

export const getUrlParams = createSelector(
  [selectAOIModalSettings, selectProfileModalOpen],
  (areaOfInterestModal, profile) => ({
    areaOfInterestModal: objDiff(
      areaOfInterestModal,
      areaOfInterestModalInitialState
    ),
    profile,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
