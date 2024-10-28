import { createAction, createThunkAction } from 'redux/actions';
import { getGadmLocationByLevel } from 'utils/gadm';
import compact from 'lodash/compact';

import useRouter from 'utils/router';

export const setMainMapSettings = createAction('setMainMapSettings');

/**
 * Push the parameters from the area clicked to the URL query
 * @param {function} createThunkAction - A string with the area's  description
 * @see https://redux.js.org/usage/writing-logic-thunks for implementation details
 * @param {string} setMainMapAnalysisView - Action name
 * @param {function} - Arrow function
 * @param {object} data - area data (adm_level, gid_0, country, ...)
 * @param {object} layer - political boundaries obejct from Layer API
 */
export const setMainMapAnalysisView = createThunkAction(
  'setMainMapAnalysisView',
  ({ data, layer }) =>
    () => {
      const { cartodb_id, wdpaid } = data || {};
      const { analysisEndpoint, tableName } = layer || {};
      const { query, pushQuery } = useRouter();
      const { map, mainMap } = query || {};

      let payload = {};

      if (data) {
        if (analysisEndpoint === 'admin') {
          payload = {
            type: 'country',
            ...getGadmLocationByLevel(data),
          };
        } else if (analysisEndpoint === 'wdpa' && wdpaid) {
          payload = {
            type: analysisEndpoint,
            adm0: wdpaid,
          };
        } else if (cartodb_id && tableName) {
          payload = {
            type: 'use',
            adm0: tableName,
            adm1: cartodb_id,
          };
        }
      }

      if (payload && payload.adm0) {
        pushQuery({
          pathname: `/map/${compact(Object.values(payload))?.join('/')}/`,
          query: {
            ...query,
            map: {
              ...map,
              canBound: true,
            },
            mainMap: {
              ...mainMap,
              showAnalysis: true,
            },
          },
        });
      }
    }
);

export const setDrawnGeostore = createThunkAction(
  'setDrawnGeostore',
  (geostoreId) => () => {
    const { pushQuery, query } = useRouter();

    const { map, mainMap } = query || {};
    pushQuery({
      pathname: `/map/geostore/${geostoreId}/`,
      query: {
        ...query,
        map: {
          ...map,
          canBound: true,
          drawing: false,
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true,
        },
      },
    });
  }
);
