import { createSelector, createStructuredSelector } from 'reselect';

export const selectMapSettings = (state) => state.map?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;

export const getUrlParams = createSelector(
  [selectMapSettings, selectMetaModalKey],
  (map, modalMeta) => ({
    map,
    modalMeta,
  })
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
