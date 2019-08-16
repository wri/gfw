import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import {
  getUserAreas,
  getActiveArea,
  getAreaTags
} from 'providers/areas-provider/selectors';

const selectLoading = state => state.mapMenu && state.mapMenu.loading;
const selectLoggedIn = state => state.myGfw && !isEmpty(state.myGfw.data);
const selectLocation = state => state.location && state.location.payload;

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getUserAreas,
  tags: getAreaTags,
  activeArea: getActiveArea
});
