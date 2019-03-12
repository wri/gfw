import queryString from 'query-string';

export const decodeUrlForState = url => {
  const paramsParsed = {};
  const params = queryString.parse(url);
  Object.keys(params).forEach(key => {
    try {
      paramsParsed[key] = JSON.parse(atob(params[key]));
    } catch (err) {
      paramsParsed[key] = params[key];
    }
  });
  return paramsParsed;
};

export const encodeStateForUrl = params => {
  const paramsParsed = {};
  Object.keys(params).forEach(key => {
    if (typeof params[key] === 'object') {
      paramsParsed[key] = btoa(JSON.stringify(params[key]));
    } else {
      paramsParsed[key] = params[key];
    }
  });
  return queryString.stringify(paramsParsed);
};

export const setComponentStateToUrl = ({ key, subKey, change, state }) => {
  const { location } = state();
  let params = change;
  if (
    location.query &&
    location.query[subKey || key] &&
    !!change &&
    typeof change === 'object'
  ) {
    params = {
      ...location.query[subKey || key],
      ...change
    };
  }

  return {
    key,
    type: location.type,
    payload: location.payload,
    query: {
      ...location.query,
      [subKey || key]: params
    }
  };
};
