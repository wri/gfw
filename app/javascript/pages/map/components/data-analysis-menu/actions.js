import { createAction, createThunkAction } from 'redux-tools';
import union from 'turf-union';
import { getGeostoreKey } from 'services/geostore';
import { fetchUmdLossGain } from 'services/analysis';
import { uploadShapeFile } from 'services/shape';

import uploadFileConfig from './components/chose-analysis/upload-file-config.json';

export const setAnalysisData = createAction('setAnalysisData');

export const getGeostore = createThunkAction(
  'getGeostore',
  geoJSON => dispatch => {
    dispatch(
      setAnalysisData({
        loading: true
      })
    );
    getGeostoreKey(geoJSON)
      .then(response => {
        if (response.data) {
          dispatch(
            setAnalysisData({
              geostore: response.data.data.id
            })
          );
        }
      })
      .catch(error => {
        console.info(error);
      });
  }
);

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
  shapeFile => dispatch => {
    dispatch(
      setAnalysisData({
        loading: true
      })
    );
    uploadShapeFile(shapeFile)
      .then(response => {
        const features = response.data
          ? response.data.data.attributes.features
          : null;
        if (features && features.length < uploadFileConfig.featureLimit) {
          const geojson = features.reduce(union);
          dispatch(
            setAnalysisData({
              polygon: geojson.geometry
            })
          );
        }
      })
      .catch(error => {
        console.info(error);
      });
  }
);
