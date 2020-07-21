import { createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = (state) => state.areas && state.areas.loading;
const selectLoggedIn = (state) => state.myGfw?.data?.loggedIn;

export const getMyGFWProps = createStructuredSelector({
  loading: selectAreasLoading,
  loggedIn: selectLoggedIn,
  areas: getUserAreas,
});
