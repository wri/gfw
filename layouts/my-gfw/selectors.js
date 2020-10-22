import { createStructuredSelector } from 'reselect';

const selectLoggedIn = (state) => state.myGfw?.data?.loggedIn;
const selectMyGfwLoading = (state) => state.myGfw?.loading;

export const getMyGFWProps = createStructuredSelector({
  loggingIn: selectMyGfwLoading,
  loggedIn: selectLoggedIn,
});
