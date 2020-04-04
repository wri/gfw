import { createStructuredSelector } from 'reselect';

// get list data
const selectUserData = (state) => state?.myGfw?.data;

export default createStructuredSelector({
  userData: selectUserData,
});
