import { createStructuredSelector } from 'reselect';

const selectUserData = (state) => state.myGfw && state.myGfw.data;

export const getUserProfleProps = createStructuredSelector({
  userData: selectUserData,
});
