import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';

import { getDatasetsProvider } from 'services/datasets';

export const setDatasetsLoading = createAction('setDatasetsLoading');
export const setDatasets = createAction('setDatasets');

export const getDatasets = createThunkAction(
  'getDatasets',
  () => (dispatch, getState) => {
    const state = getState();
    if (state.datasets.datasets.length > 0) {
      return;
    }

    dispatch(setDatasetsLoading({ loading: true, error: false }));
    getDatasetsProvider()
      .then(response => {
        const serializedDatasets = wriAPISerializer(response.data);
        let datasets = serializedDatasets;
        if (!Array.isArray(datasets)) {
          datasets = [datasets];
        }
        dispatch(setDatasets(datasets.filter(d => d.layer.length)));
      })
      .catch(err => {
        dispatch(setDatasetsLoading({ loading: false, error: true }));
        console.warn(err);
      });
  }
);
