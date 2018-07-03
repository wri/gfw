// import isEqual from 'lodash/isEqual';
// import pick from 'lodash/pick';
import queryString from 'query-string';

export const decodeUrlForState = url => {
  const paramsParsed = {};
  const params = queryString.parse(url);
  Object.keys(params).forEach(key => {
    paramsParsed[key] = JSON.parse(atob(params[key]));
  });
  return paramsParsed;
};

export const encodeStateForUrl = params => {
  const paramsParsed = {};
  Object.keys(params).forEach(key => {
    paramsParsed[key] = btoa(JSON.stringify(params[key]));
  });
  return queryString.stringify(paramsParsed);
};

export const setComponentStateToUrl = ({ key, change, state }) => {
  const { location } = state();
  let params = change;
  if (location.query && location.query[key]) {
    params = {
      ...location.query[key],
      ...change
    };
  }
  return {
    key,
    type: location.type,
    payload: location.payload,
    query: {
      ...location.query,
      [key]: params
    }
  };
};

// export const isObjectContained = (contained, container) =>
//   isEqual(pick(container, Object.keys(contained)), contained);

// export const setUrlStateToStore = ({
//   key,
//   query,
//   setState,
//   dispatch,
//   getState
// }) => {
//   if (query && query[key]) {
//     const state = decodeUrlForState(query[key]);
//     const { settings } = getState()[key];
//     // Check if the state needs and update checking the values of the new config
//     // with the existing in the url to avoid dispatch actions without changes
//     if (!isObjectContained(state, settings)) {
//       dispatch(setState(state));
//     }
//   }
// };
