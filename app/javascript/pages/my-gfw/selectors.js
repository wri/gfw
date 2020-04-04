import { createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = (state) => state?.areas?.loading;
const selectLoggedIn = (state) => state?.myGfw?.data?.loggedIn;
const selectLoggingIn = (state) => state?.myGfw?.loading;

export default createStructuredSelector({
  loggingIn: selectLoggingIn,
  loading: selectAreasLoading,
  areas: getUserAreas,
  loggedIn: selectLoggedIn,
});
