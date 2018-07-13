import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import wriAPISerializer from 'wri-json-api-serializer';
import { scalePow } from 'd3-scale';

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
      datasets = datasets.map(d => ({
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
                      id: l.id,
                      config: l.interactionConfig.output
                    })
                  );
                }
              }
            }),
          decode: true,
          decodeFunction: (data, w, h, z) => {
            const components = 4;
            const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
            const yearStart = 2001;
            const yearEnd = 2016;
            const imgData = data;

            const myscale = scalePow()
              .exponent(exp)
              .domain([0, 256])
              .range([0, 256]);

            for (let i = 0; i < w; ++i) {
              for (let j = 0; j < h; ++j) {
                const pixelPos = (j * w + i) * components;
                const intensity = imgData[pixelPos];
                const yearLoss = 2000 + imgData[pixelPos + 2];

                if (yearLoss >= yearStart && yearLoss < yearEnd) {
                  imgData[pixelPos] = 220;
                  imgData[pixelPos + 1] =
                    72 - z + 102 - 3 * myscale(intensity) / z;
                  imgData[pixelPos + 2] = 33 - z + 153 - intensity / z;
                  imgData[pixelPos + 3] =
                    z < 13 ? myscale(intensity) : intensity;
                } else {
                  imgData[pixelPos + 3] = 0;
                }
              }
            }
          }
        }))
      }));
      dispatch(setDatasets(datasets.map(d => ({ ...d, dataset: d.id }))));
    })
    .catch(err => {
      dispatch(setDatasetsLoading({ loading: false, error: true }));
      console.warn(err);
    });
});
