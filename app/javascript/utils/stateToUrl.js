import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

import { getRouter } from 'utils/withRouter';

import oldLayers from 'data/v2-v3-datasets-layers.json';

const oldLayersAndDatasets = oldLayers.reduce(
  (obj, item) => ({
    ...obj,
    ...(item.v2_dataset_id && {
      [item.v2_dataset_id]: item.v3_dataset_id,
    }),
    ...(item.v2_layer_id && {
      [item.v2_layer_id]: item.v3_layer_id,
    }),
  }),
  {}
);

export const decodeUrlForState = (params) => {
  const paramsParsed = {};
  Object.keys(params).forEach((key) => {
    try {
      paramsParsed[key] = JSON.parse(atob(params[key]));
    } catch (err) {
      paramsParsed[key] = params[key];
    }
  });

  if (paramsParsed.map) {
    paramsParsed.map = {
      ...paramsParsed.map,
      ...(paramsParsed.map.datasets && {
        datasets:
          paramsParsed.map &&
          paramsParsed.map.datasets.reduce(
            (arr, dataset) => [
              ...arr,
              {
                ...dataset,
                dataset:
                  oldLayersAndDatasets[dataset.dataset] || dataset.dataset,
                layers: dataset.layers.reduce(
                  (lArr, layerId) => [
                    ...lArr,
                    oldLayersAndDatasets[layerId] || layerId,
                  ],
                  []
                ),
              },
            ],
            []
          ),
      }),
    };
  }

  return paramsParsed;
};

export const encodeStateForUrl = (params) => {
  const paramsParsed = {};
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'object') {
      paramsParsed[key] = btoa(JSON.stringify(params[key]));
    } else {
      paramsParsed[key] = params[key];
    }
  });
  return queryString.stringify(paramsParsed);
};

export const setComponentStateToUrl = ({ key, subKey, change }) => {
  const router = getRouter();
  const { query, pathname, pushDynamic } = router || {};

  let params = change;
  if (query && query[subKey || key] && !!change && typeof change === 'object') {
    params = {
      ...query[subKey || key],
      ...change,
    };
  }

  // if a false value is sent we should remove the key from the url
  const cleanLocationQuery =
    !change && query ? omit(query, [subKey || key]) : query;
  pushDynamic({
    pathname,
    query: {
      ...cleanLocationQuery,
      ...query.location && {
        location: query.location.join('/')
      },
      ...(params && {
        [subKey || key]: params,
      }),
    },
  });
};

const handleStateUpdate = (store, params) => {
  const state = store.getState()
  const { query, pathname, pushDynamic } = getRouter();
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
  const { asPath } = getRouter();

  const query = asPath.includes('?') ? qs.parse(asPath.split('?')[1]) : {};

  if (query) {
    const queryKeys = Object.keys(query);
    const actionsToDispatch = queryKeys && queryKeys.reduce((arr, key) => {
      const value = query[key];
      const decodedValue = JSON.parse(atob(query[key]));
      if ((isEmpty(lastQueryValues) || lastQueryValues[key] !== value)) {
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
  const router = getRouter();
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