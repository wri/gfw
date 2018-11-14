import { createStructuredSelector } from 'reselect';

export const selectTourOpen = state => state.mapTour.open;

export const getMapTourProps = createStructuredSelector({
  open: selectTourOpen
});
