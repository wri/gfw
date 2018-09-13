import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const selectLoggedIn = state => !isEmpty(state.myGfw.data) || null;

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn
});
