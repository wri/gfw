import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

// get list data
const getData = state => state.data || null;
const getPage = state => state.page || null;
const getPageSize = state => state.pageSize || null;

// get lists selected
export const filterData = createSelector(
  [getData, getPage, getPageSize],
  (data, page, pageSize) => {
    if (isEmpty(data) || !data.length) return null;
    return data.slice(page * pageSize, page * pageSize + pageSize);
  }
);
