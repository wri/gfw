import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';

import { getDatasetsProvider } from 'services/datasets';
import { setInteraction } from 'components/map/components/popup/actions';

export const setDatasetsLoading = createAction('setDatasetsLoading');
export const setDatasets = createAction('setDatasets');

export const getDatasets = createThunkAction('getDatasets', () => dispatch => {
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
        layer: d.layer.map(l => ({
          ...l,
          ...(l.interactionConfig.output &&
            l.interactionConfig.output.length && {
              interactivity: l.interactionConfig.output.map(i => i.column),
              events: {
                click: e => {
                  dispatch(
                    setInteraction({
                      ...e,
                      label: l.name,
                      article: l.name === 'Places to Watch',
                      id: l.id,
                      value: l.id,
                      config: l.interactionConfig.output
                    })
                  );
                }
              }
            })
        }))
      }));
      dispatch(setDatasets(datasets.map(d => ({ ...d, dataset: d.id }))));
    })
    .catch(err => {
      dispatch(setDatasetsLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
