import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

import { getAllAreas } from 'providers/areas-provider/selectors';

const selectAreaOfInterestModalState = state =>
  state.location &&
  state.location.query &&
  state.location.query.areaOfInterestModal;
const selectLoading = state => state.areas && state.areas.loading;
const selectLoggedIn = state =>
  state.myGfw && state.myGfw.data && state.myGfw.data.loggedIn;
const selectLocation = state => state.location && state.location.payload;
const selectUserData = state => state.myGfw && state.myGfw.data;

export const getActiveArea = createSelector(
  [selectLocation, selectAreaOfInterestModalState, getAllAreas],
  (location, settings, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = '';
    if (location.type === 'aoi') {
      activeAreaId = location.adm0;
    } else {
      activeAreaId = settings && settings.activeAreaId;
    }
    return areas.find(a => a.id === activeAreaId);
  }
);

export const getInitialValues = createSelector(
  [selectUserData, getActiveArea],
  (userData, area) => {
    const { email, language } = userData;
    const { fireAlerts, deforestationAlerts, monthlySummary, ...rest } =
      area || {};

    return {
      email,
      language,
      alerts: compact([
        fireAlerts ? 'fireAlerts' : false,
        deforestationAlerts ? 'deforestationAlerts' : false,
        monthlySummary ? 'monthlySummary' : false
      ]),
      ...rest
    };
  }
);

export const getFormTitle = createSelector(
  [getInitialValues],
  ({ id } = {}) => {
    if (id) {
      return 'Edit area of Interest';
    }

    return 'Save area of interest';
  }
);

// export const getModalTitle = createSelector(
//   [getActiveArea, selectUserData, selectSaved, selectDeleted],
//   (activeArea, userData, saved, deleted) => {
//     if (deleted) {
//       return 'Area of Interest Deleted';
//     }
//     if (saved) {
//       return 'Area of Interest Saved';
//     }
//     if (activeArea && activeArea.userArea && !isEmpty(userData)) {
//       return 'Edit Area of Interest';
//     }
//     return 'Save Area of Interest';
//   }
// );

// export const getModalDesc = createSelector(
//   [getActiveArea, selectSaved, selectDeleted],
//   (area, saved, deleted) => {
//     if (isEmpty(area)) return null;
//     const { fireAlerts, deforestationAlerts, monthlySummary, confirmed } = area;
//     const hasSubscription = fireAlerts || deforestationAlerts || monthlySummary;

//     if (deleted) {
//       return 'This area of interest has been deleted from your My GFW.';
//     }

//     if (saved && hasSubscription && !confirmed) {
//       return "<b>Check your email and click on the link to confirm your subscription.</b> If you don't see an email, check your junk or spam email folder.";
//     }

//     return 'Your area has been updated. You can view all your areas in My GFW.';
//   }
// );

export const getAreaOfInterestProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  initialValues: getInitialValues,
  title: getFormTitle
});
