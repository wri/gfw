import { createThunkAction } from 'redux-tools';
import { getLocationFromData } from 'utils/format';

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  category => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
    dispatch({
      type,
      payload,
      query: {
        ...query,
        category,
        widget: undefined
      }
    });
  }
);

export const handleLocationChange = createThunkAction(
  'handleLocationChange',
  location => (dispatch, getState) => {
    const { query, type } = getState().location || {};
    const { data, layer } = location || {};
    const newQuery = {};

    if (query) {
      Object.keys(query).forEach(key => {
        const queryObj = query[key] || {};
        if (typeof queryObj === 'object') {
          const { forestType, landCategory, page } = queryObj;
          newQuery[key] = {
            ...queryObj,
            ...(forestType && {
              forestType: ''
            }),
            ...(landCategory && {
              landCategory: ''
            }),
            ...(page && {
              page: 0
            })
          };
        } else {
          newQuery[key] = queryObj;
        }
      });
    }

    let payload = {};
    if (data) {
      const { cartodb_id, wdpaid } = data || {};
      const { analysisEndpoint, tableName } = layer || {};
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getLocationFromData(data)
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        payload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodb_id
        };
      } else if (cartodb_id && tableName) {
        payload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodb_id
        };
      }
    } else {
      payload = {
        type: location.adm0 ? 'country' : 'global',
        ...location
      };
    }

    dispatch({
      type,
      payload,
      query: {
        ...newQuery,
        widget: undefined,
        map: {
          ...(query && query.map),
          canBound: true
        }
      }
    });
  }
);
