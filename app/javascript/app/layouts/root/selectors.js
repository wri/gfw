import { createStructuredSelector } from 'reselect';

const selectLoggedIn = state => !!state.myGfw.data || null;
const selectLocation = state =>
  state.location && state.location.routesMap[state.location.type];

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  route: selectLocation
});
