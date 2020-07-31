import { createSelector, createStructuredSelector } from 'reselect';

export const selectSgfModalSlug = (state) => state.sgfModal?.open;

export const getUrlParams = createSelector(
  [selectSgfModalSlug],
  (sgfModal) => ({
    sgfModal,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
