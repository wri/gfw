import { createThunkAction } from 'redux-tools';
import { getLocationFromData } from 'utils/format';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapMainSettings = createThunkAction(
  'setMapMainSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'mapMain',
        change,
        state
      })
    )
);

export const setMapAnalysisView = createThunkAction(
  'setMapAnalysisView',
  ({ data, layer }) => (dispatch, getState) => {
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const { query, type } = getState().location;
    const { map, analysis } = query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
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
    }

    if (payload && payload.adm0) {
      dispatch({
        type,
        payload,
        query: {
          ...query,
          map: {
            ...map,
            canBound: true
          },
          analysis: {
            ...analysis,
            showAnalysis: true
          }
        }
      });
    }
  }
);
