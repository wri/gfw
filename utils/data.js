import reduce from 'lodash/reduce';
import isEqual from 'lodash/isEqual';

export const sortByKey = (array, key, isAsc) =>
  array.sort((a, b) => {
    if (!isAsc) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });

export const objDiff = (obj1, obj2) => {
  return reduce(
    obj1,
    (result, value, key) => {
      if (!isEqual(value, obj2[key])) {
        result[key] = value;
      }
      return result;
    },
    {}
  );
};
