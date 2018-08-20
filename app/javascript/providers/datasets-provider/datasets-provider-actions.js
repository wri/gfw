import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';
import isEmpty from 'lodash/isEmpty';

import { getDatasetsProvider } from 'services/datasets';
import { setInteraction } from 'components/map/components/popup/actions';

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

        datasets = datasets.filter(d => d.layer.length).map(d => ({
          ...d,
          dataset: d.id,
          layer: d.layer.map(l => {
            const { interactionConfig } = l;
            const { output, article } = interactionConfig || {};
            return {
              ...l,
              ...(!isEmpty(output) && {
                interactivity: output.map(i => i.column),
                events: {
                  click: e => {
                    dispatch(
                      setInteraction({
                        ...e,
                        label: l.name,
                        article,
                        id: l.id,
                        value: l.id,
                        config: output
                      })
                    );
                  }
                }
              })
            };
          })
        }));
        dispatch(setDatasets(datasets));
      })
      .catch(err => {
        dispatch(setDatasetsLoading({ loading: false, error: true }));
        console.warn(err);
      });
  }
);
