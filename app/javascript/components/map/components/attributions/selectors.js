import { createStructuredSelector, createSelector } from 'reselect';
import { SCREEN_M } from 'utils/constants';

export const selectMap = (state, { map }) => map;
export const selectViewport = (state, { viewport }) => viewport;

export const getIsSmallView = createSelector(
  [selectMap, selectViewport],
  map => {
    const width = map._container.clientWidth;
    return width < SCREEN_M;
  }
);

export const getAttributionProps = createStructuredSelector({
  smallView: getIsSmallView
});
