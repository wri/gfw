import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getDatasets = state => state.datasets || null;

export const getActiveLayers = createSelector([getDatasets], datasets => {
  if (isEmpty(datasets)) return null;

  return datasets.map(d => ({
    dataset: d.id,
    opacity: 1,
    visible: true,
    layers:
      d.layer &&
      d.layer.map(l => ({
        ...l,
        active: true,
        opacity: 1,
        visible: true
      }))
  }));
});
