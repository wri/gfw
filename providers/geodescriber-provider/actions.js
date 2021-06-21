import { createAction, createThunkAction } from 'redux/actions';
import isEmpty from 'lodash/isEmpty';

import { getGeodescriberByGeoJson } from 'services/geodescriber';
import { getSentenceData } from 'services/sentences';

export const setGeodescriberLoading = createAction('setGeodescriberLoading');
export const setGeodescriber = createAction('setGeodescriber');
export const clearGeodescriber = createAction('clearGeodescriber');

export const getGeodescriber = createThunkAction(
  'getGeodescriber',
  (params) => (dispatch) => {
    if (!isEmpty(params)) {
      dispatch(setGeodescriberLoading({ loading: true, error: false }));
      getGeodescriberByGeoJson({ ...params, template: true })
        .then((response) => {
          dispatch(setGeodescriber(response.data.data));
        })
        .catch(() => {
          dispatch(setGeodescriberLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getAdminStats = (params) => getSentenceData(params);

export const setGeodescriberSSR = (payload) => setGeodescriber(payload);

export const getAdminGeodescriber = createThunkAction(
  'getAdminGeodescriber',
  (location) => (dispatch) => {
    dispatch(setGeodescriberLoading({ loading: true, error: false }));
    getAdminStats({ ...location, threshold: 30, extentYear: 2010 })
      .then((response) => {
        dispatch(setGeodescriber(response));
      })
      .catch(() => {
        dispatch(setGeodescriberLoading({ loading: false, error: true }));
      });
  }
);
