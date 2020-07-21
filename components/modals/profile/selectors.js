import { createStructuredSelector } from 'reselect';

const selectProfileOpen = (state) => state.profile?.open;

const selectUsername = (state) =>
  state.myGfw &&
  state.myGfw.data &&
  !!(state.myGfw.data.fullName || state.myGfw.data.lastName);

export const getModalAOIProps = createStructuredSelector({
  open: selectProfileOpen,
  filledProfile: selectUsername,
});
