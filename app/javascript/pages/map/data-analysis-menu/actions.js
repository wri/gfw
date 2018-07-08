import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getGeostoreKey } from 'services/geostore';
import { fetchUmdLossGain } from 'services/analysis';

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

export default {
  setAnalysisData,
  getGeostore,
  getAnalysis
};
