import { createStructuredSelector } from 'reselect';

// get list data
const selectUserData = state => state.myGfw && state.myGfw.data;

export const getUserProfleProps = createStructuredSelector({
  userData: selectUserData
});
