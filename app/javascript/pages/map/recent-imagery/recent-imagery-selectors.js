import { createSelector } from 'reselect';

// get list data

// get lists selected

export const getDates = createSelector([], () => ({
  start: '2016-01-01',
  end: '2016-09-01'
}));
