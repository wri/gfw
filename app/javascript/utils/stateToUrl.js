import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

export const encodeStateForUrl = obj => btoa(JSON.stringify(obj));

export const decodeUrlForState = string => JSON.parse(atob(string));

export const isObjectContained = (contained, container) =>
  isEqual(pick(container, Object.keys(contained)), contained);

export const setComponentStateToUrl = ({ key, change, dispatch, state }) => {
  const { location } = state();
  let params = change;
  if (location.query && location.query[key]) {
    params = {
      ...decodeUrlForState(location.query[key]),
      ...change
    };
  }
  dispatch({
    key,
    type: location.type,
    payload: location.payload,
    query: {
      ...location.query,
      [key]: encodeStateForUrl(params)
    }
  });
};

export const setUrlStateToStore = ({
  key,
  query,
  setState,
  dispatch,
  getState
}) => {
  if (query && query[key]) {
    const state = decodeUrlForState(query[key]);
    const { settings } = getState()[key];
    // Check if the state needs and update checking the values of the new config
    // with the existing in the url to avoid dispatch actions without changes
    if (!isObjectContained(state, settings)) {
      dispatch(setState(state));
    }
  }
};
