import { createStructuredSelector } from 'reselect';

const selectUrlToken = (state) => state?.location?.query?.token;
const selectLocalToken = () =>
  typeof window !== 'undefined'
    ? localStorage && localStorage.getItem('mygfw_token')
    : '';

export default createStructuredSelector({
  urlToken: selectUrlToken,
  localToken: selectLocalToken,
});
