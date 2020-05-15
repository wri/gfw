import { createStructuredSelector } from 'reselect';

const selectProfileUrlState = state =>
  state.location && state.location.query && !!state.location.query.profile;

const selectUsername = state =>
  state.myGfw &&
  state.myGfw.data &&
  !!(state.myGfw.data.fullName || state.myGfw.data.lastName);

export const getModalAOIProps = createStructuredSelector({
  open: selectProfileUrlState,
  filledProfile: selectUsername
});
