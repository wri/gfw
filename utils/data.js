import reduce from 'lodash/reduce';
import isEqual from 'lodash/isEqual';

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
