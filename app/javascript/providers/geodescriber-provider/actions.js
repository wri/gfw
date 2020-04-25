import { createAction, createThunkAction } from 'utils/redux';
import isEmpty from 'lodash/isEmpty';

import { getGeodescriberService } from 'services/geostore';

import getAdminStats from './utils';

export const setGeodescriberLoading = createAction('setGeodescriberLoading');
export const setGeodescriber = createAction('setGeodescriber');
export const clearGeodescriber = createAction('clearGeodescriber');

export const getGeodescriber = createThunkAction(
  'getGeodescriber',
  params => dispatch => {
    if (!isEmpty(params)) {
      dispatch(setGeodescriberLoading({ loading: true, error: false }));
      getGeodescriberService(params)
        .then(response => {
          dispatch(setGeodescriber(response.data.data));
        })
        .catch(() => {
          dispatch(setGeodescriberLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getAdminGeodescriber = createThunkAction(
  'getAdminGeodescriber',
  location => dispatch => {
    dispatch(setGeodescriberLoading({ loading: true, error: false }));
    getAdminStats({ ...location, threshold: 30, extentYear: 2010 })
      .then(response => {
        dispatch(setGeodescriber(response));
      })
      .catch(() => {
        dispatch(setGeodescriberLoading({ loading: false, error: true }));
      });
  }
);
