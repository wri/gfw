import { createStructuredSelector } from 'reselect';

const selectProfileUrlState = state =>
  state.location && state.location.query && state.location.query.profile;

export const getModalAOIProps = createStructuredSelector({
  open: selectProfileUrlState
});
