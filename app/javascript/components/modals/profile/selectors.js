import { createStructuredSelector } from 'reselect';

const selectProfileModalOpen = state => state?.profileModal?.open;
const selectUsername = state => state?.myGfw?.data && !!(state?.myGfw?.data?.fullName || state?.myGfw?.data?.lastName);

export default createStructuredSelector({
  open: selectProfileModalOpen,
  filledProfile: selectUsername
});
