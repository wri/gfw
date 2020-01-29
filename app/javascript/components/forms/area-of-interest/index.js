import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

const mapStateToProps = ({ myGfw, countryData }) => ({
  countries: countryData && countryData.countries,
  ...(myGfw &&
    myGfw.data && {
    initialValues: {
      ...myGfw.data,
      signUpForTesting: myGfw.data.signUpForTesting ? ['yes'] : false
    }
  })
});

export default connect(mapStateToProps, actions)(Component);

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
