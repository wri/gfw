import { createSelector, createStructuredSelector } from 'reselect';

const selectDatasets = state => state.datasets.datasets;

const getLatestEndpoints = createSelector(
  selectDatasets,
  datasets =>
    datasets &&
    datasets.length &&
    datasets.reduce((arr, next) => {
      const config = next.decode_config || next.params_config;
      const endDate = config && config.find(c => c.key === 'endDate' && c.url);
      console.log(next);
      if (endDate && endDate.url) {
        return endDate.url;
      }
      return arr;
    }, [])
);

export const getLatestProps = createStructuredSelector({
  latestEndpoints: getLatestEndpoints
});
