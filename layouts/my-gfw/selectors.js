import { createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = (state) => state.areas && state.areas.loading;
const selectLoggedIn = (state) => state.myGfw?.data?.loggedIn;
const selectMyGfwLoading = (state) => state.myGfw?.loading;

export const getMyGFWProps = createStructuredSelector({
  areasLoading: selectAreasLoading,
  loggingIn: selectMyGfwLoading,
  loggedIn: selectLoggedIn,
  areas: getUserAreas,
});
