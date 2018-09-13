import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const selectLoggedIn = state => !isEmpty(state.myGfw.data) || null;
const selectLocation = state =>
  state.location && state.location.routesMap[state.location.type];

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  route: selectLocation
});
