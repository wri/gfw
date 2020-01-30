import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

import { getAllAreas } from 'providers/areas-provider/selectors';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';

const selectAreaOfInterestModalState = state =>
  state.location &&
  state.location.query &&
  state.location.query.areaOfInterestModal;
const selectLoading = state => state.areas && state.areas.loading;
const selectLoggedIn = state =>
  state.myGfw && state.myGfw.data && state.myGfw.data.loggedIn;
const selectLocation = state => state.location && state.location.payload;
const selectUserData = state => state.myGfw && state.myGfw.data;
const selectGeostoreId = state =>
  state.geostore && state.geostore.data && state.geostore.data.id;

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
  [selectUserData, getActiveArea, getGeodescriberTitleFull, selectGeostoreId],
  (userData, area, locationName, geostoreId) => {
    const { email: userEmail, language: userLanguage } = userData;
    const {
      fireAlerts,
      deforestationAlerts,
      monthlySummary,
      name,
      email,
      language,
      ...rest
    } =
      area || {};

    return {
      alerts: compact([
        fireAlerts ? 'fireAlerts' : false,
        deforestationAlerts ? 'deforestationAlerts' : false,
        monthlySummary ? 'monthlySummary' : false
      ]),
      geostore: geostoreId,
      ...rest,
      name: name || locationName,
      email: email || userEmail,
      language: language || userLanguage
    };
  }
);

export const getFormTitle = createSelector(
  [getInitialValues],
  ({ id, userArea } = {}) => {
    if (id && userArea) {
      return 'Edit area of Interest';
    }

    return 'Save area of interest';
  }
);

export const getAreaOfInterestProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  initialValues: getInitialValues,
  title: getFormTitle
});
