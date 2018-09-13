import { createAction, createThunkAction } from 'redux-tools';
import union from 'turf-union';

import { fetchUmdLossGain } from 'services/analysis';
import { uploadShapeFile } from 'services/shape';
import { getGeostoreKey } from 'services/geostore';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { MAP } from 'router';

import uploadFileConfig from './upload-config.json';

// url action
export const setAnalysisSettings = createThunkAction(
  'setAnalysisSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'analysis',
        change,
        state
      })
    );
  }
);

// store actions
export const setAnalysisData = createAction('setAnalysisData');
export const setAnalysisLoading = createAction('setAnalysisLoading');
export const clearAnalysisError = createAction('clearAnalysisError');

export const getAnalysis = createThunkAction(
  'getAnalysis',
  geostore => dispatch => {
    fetchUmdLossGain(geostore)
      .then(response => {
        if (response.data) {
          dispatch(
            setAnalysisData({
              data: response.data.data.attributes,
              loading: false,
              showResults: true
            })
          );
        }
      })
      .catch(error => {
        console.info(error);
      });
  }
);

export const uploadShape = createThunkAction(
  'uploadShape',
  ({ shape, query }) => dispatch => {
    dispatch(setAnalysisLoading({ loading: true, error: '' }));
    uploadShapeFile(shape)
      .then(response => {
        if (response && response.data && response.data.data) {
          const features = response.data
            ? response.data.data.attributes.features
            : null;
          if (features && features.length < uploadFileConfig.featureLimit) {
            const geojson = features.reduce(union);
            getGeostoreKey(geojson.geometry)
              .then(geostore => {
                if (geostore && geostore.data && geostore.data.data) {
                  const { id } = geostore.data.data;
                  dispatch({
                    type: MAP,
                    payload: {
                      type: 'draw',
                      country: id
                    },
                    ...(query && {
                      query: {
                        ...query,
                        ...(query.map && {
                          map: {
                            ...query.map,
                            canBound: true
                          }
                        })
                      }
                    })
                  });
                  dispatch(
                    setAnalysisLoading({
                      loading: false,
                      error: '',
                      errorMessage: ''
                    })
                  );
                }
              })
              .catch(error => {
                dispatch(
                  setAnalysisLoading({
                    loading: false,
                    error: 'error with shape',
                    errorMessage:
                      (error.response.data &&
                        error.response.data.errors &&
                        error.response.data.errors[0].detail) ||
                      'error with shape'
                  })
                );
                console.info(error);
              });
          }
        }
      })
      .catch(error => {
        dispatch(
          setAnalysisLoading({
            loading: false,
            error: 'error with shape',
            errorMessage:
              (error.response.data &&
                error.response.data.errors &&
                error.response.data.errors[0].detail) ||
              'error with shape'
          })
        );
        console.info(error);
      });
  }
);
