import { createSelector, createStructuredSelector } from 'reselect';

export const selectAOIModalSettings = (state) => state.areaOfInterestModal;
export const selectProfileModalOpen = (state) => state.profile?.open;

export const getUrlParams = createSelector(
  [selectAOIModalSettings, selectProfileModalOpen],
  (areaOfInterestModal, profile) => ({
    areaOfInterestModal,
    profile,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
