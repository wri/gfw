import { createStructuredSelector } from 'reselect';

const selectUrlToken = state =>
  state.location && state.location.query && state.location.query.token;
const selectLocalToken = () => localStorage.getItem('mygfw_token');

export const getMyGfwProps = createStructuredSelector({
  urlToken: selectUrlToken,
  localToken: selectLocalToken
});
