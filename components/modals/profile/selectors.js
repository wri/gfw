import { createStructuredSelector } from 'reselect';

const selectProfileIncomplete = (state) =>
  !state.myGfw?.data?.fullName || !state.myGfw?.data?.lastName;

export const getProfileModalProps = createStructuredSelector({
  profileIncomplete: selectProfileIncomplete,
});
