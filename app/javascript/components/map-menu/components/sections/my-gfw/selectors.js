import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import {
  getUserAreas,
  getActiveArea,
  getAreaTags
} from 'providers/areas-provider/selectors';

const selectLoading = state =>
  state.areas && state.myGfw && (state.areas.loading || state.myGfw.loading);
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const selectLocation = state => state.location && state.location.payload;
const selectUserData = state => state.myGfw && state.myGfw.data;

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getUserAreas,
  tags: getAreaTags,
  activeArea: getActiveArea,
  userData: selectUserData
});
