import { createStructuredSelector } from 'reselect';

const isServer = typeof window === 'undefined';

const selectUrlToken = state =>
  state.location && state.location.query && state.location.query.token;
const selectLocalToken = () => !isServer && localStorage.getItem('mygfw_token');

export const getMyGfwProps = createStructuredSelector({
  urlToken: selectUrlToken,
  localToken: selectLocalToken
});
