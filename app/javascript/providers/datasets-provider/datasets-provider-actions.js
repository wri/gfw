import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';

import { getDatasetsProvider } from 'services/datasets';

export const setDatasetsLoading = createAction('setDatasetsLoading');
export const setDatasetsData = createAction('setDatasetsData');

export const getDatasets = createThunkAction('getDatasets', () => dispatch => {
  dispatch(setDatasetsLoading({ loading: true, error: false }));
  getDatasetsProvider()
    .then(datasets => {
      dispatch(setDatasetsData(wriAPISerializer(datasets.data)) || []);
    })
    .catch(error => {
      dispatch(setDatasetsLoading({ loading: false, error: true }));
      console.info(error);
    });
});
