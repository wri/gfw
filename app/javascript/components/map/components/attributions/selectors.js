import { createStructuredSelector, createSelector } from 'reselect';

export const selectMap = (state, { map }) => map;
export const selectViewport = (state, { viewport }) => viewport;

export const getIsSmallView = createSelector(
  [selectMap, selectViewport],
  map => {
    const width = map._container.clientWidth;
    return width < 600;
  }
);

export const getAttributionProps = createStructuredSelector({
  smallView: getIsSmallView
});
