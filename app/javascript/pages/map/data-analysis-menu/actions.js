import { createAction } from 'redux-actions';
import union from '@turf/union';
import { createThunkAction } from 'utils/redux';
import { getGeostoreKey } from 'services/geostore';
import { fetchUmdLossGain } from 'services/analysis';
import { uploadShapeFile } from 'services/shape';

import uploadFileConfig from './components/polygon-analysis/upload-file-config.json';

const setAnalysisData = createAction('setAnalysisData');

const getGeostore = createThunkAction('getGeostore', geoJSON => dispatch => {
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
});

const getAnalysis = createThunkAction('getAnalysis', geostore => dispatch => {
  fetchUmdLossGain(geostore)
    .then(response => {
      if (response.data) {
        dispatch(
          setAnalysisData({
            data: response.data.data.attributes
          })
        );
      }
    })
    .catch(error => {
      console.info(error);
    });
});

const uploadShape = createThunkAction('uploadShape', shapeFile => dispatch => {
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
});

export default {
  setAnalysisData,
  getGeostore,
  getAnalysis,
  uploadShape
};
