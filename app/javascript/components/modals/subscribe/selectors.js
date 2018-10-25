import { createStructuredSelector } from 'reselect';

// get list data
const selectOpen = state => state.modalSubscribe.open;
const selectUserData = state => state.myGfw.data;

export const getModalSubscribeProps = createStructuredSelector({
  open: selectOpen,
  userData: selectUserData
});
