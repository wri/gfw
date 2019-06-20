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
    const { query, type, payload } = getState().location || {};
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

    let newPayload = {};
    if (data) {
      const { cartodb_id, wdpaid } = data || {};
      const { analysisEndpoint, tableName } = layer || {};
      if (analysisEndpoint === 'admin') {
        newPayload = {
          type: payload.type === 'global' ? 'country' : payload.type,
          ...getLocationFromData(data)
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        newPayload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodb_id
        };
      } else if (cartodb_id && tableName) {
        newPayload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodb_id
        };
      }
    } else {
      const newAdminType = !location.adm0 ? 'global' : 'country';
      newPayload = {
        type: payload.type === 'global' ? newAdminType : payload.type,
        ...location
      };
    }

    dispatch({
      type,
      payload: newPayload,
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

export const closeMobileMap = createThunkAction(
  'setActiveWidget',
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        showMap: undefined
      }
    });
  }
);
