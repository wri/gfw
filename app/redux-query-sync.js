import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import qs from 'query-string';

import useRouter from 'app/router';

const handleStateUpdate = (store, params) => {
  const state = store.getState()
  const { query, pathname, pushDynamic } = useRouter();
  // Parse the current location's query string.

  // object with pathname params inside
  const locationParams = {};
  // object with query for seaerch
  const queryParams = {};

  // split query from pathname params
  Object.keys(query).forEach(param => {
    if (pathname.includes(`[${param}]`)) {
      locationParams[param] = query[param];
    } else if (pathname.includes(`[...${param}]`)) {
      locationParams[param] = query[param].join('/')
    } else {
      queryParams[param] = query[param]
    }
  })

  // object for state merged with query
  const stateWithQueryParams = { ...queryParams };

  // update query params with state values
  Object.keys(params).forEach(param => {
    const { selector, defaultValue } = params[param]
    const value = selector(state)
    if (value !== defaultValue) {
      stateWithQueryParams[param] = value
    } else {
      delete stateWithQueryParams[param]
    }
  })

  const stateChanged = !isEqual(stateWithQueryParams, queryParams);

  if (stateChanged) {
    const newLocation = {
      pathname,
      query: {
        ...stateWithQueryParams,
        ...locationParams
      }
    }
    pushDynamic(newLocation)
  }
}

const lastQueryValues = {};

const handleLocationUpdate = (store, params) => {
  const state = store.getState()
  const { asPath } = useRouter();

  const query = asPath.includes('?') ? qs.parse(asPath.split('?')[1]) : {};

  if (query) {
    const queryKeys = Object.keys(query);
    const actionsToDispatch = queryKeys && queryKeys.reduce((arr, key) => {
      const value = query[key];
      const decodedValue = JSON.parse(atob(query[key]));
      if (params[key] && (isEmpty(lastQueryValues) || lastQueryValues[key] !== value)) {
        const { selector, action } = params[key];
        lastQueryValues[key] = value
        if (selector(state) !== decodedValue) {
          return [...arr, action(decodedValue)]
        }
      }
      return []
    }, [])

    actionsToDispatch.forEach(action => {
      store.dispatch(action)
    })
  }
}

export default ({
  store,
  params
}) => {
  const router = useRouter();
  if (router) {
    // Sync location to store on every location change, and vice versa.
    const unsubscribeFromLocation = router.events.on('routeChangeComplete', () => handleLocationUpdate(store, params))
    const unsubscribeFromStore = store.subscribe(() => handleStateUpdate(store, params))

    // Sync location to store now, or vice versa, or neither.
    handleLocationUpdate(store, params)

    return function unsubscribe() {
      unsubscribeFromLocation()
      unsubscribeFromStore()
    }
  }

  return false;
}