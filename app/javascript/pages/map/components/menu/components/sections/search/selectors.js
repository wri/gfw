import { createSelector, createStructuredSelector } from 'reselect';
import { deburrUpper } from 'utils/data';
import sortBy from 'lodash/sortBy';

import { getActiveDatasetsState } from 'components/map-v2/selectors';

const selectSearch = state =>
  state.location &&
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.search;
const selectDatasets = state => state.datasets.datasets || null;

const getDatasetWithUrlState = createSelector(
  [getActiveDatasetsState, selectDatasets],
  (datasetsState, datasets) => {
    const datasetIds = datasetsState.map(d => d.dataset);

    return (
      datasets &&
      sortBy(
        datasets.map(d => ({
          ...d,
          active: datasetIds.includes(d.id)
        })),
        ['name']
      )
    );
  }
);

const getFilteredDatasets = createSelector(
  [getDatasetWithUrlState, selectSearch],
  (datasets, search) =>
    (search && datasets
      ? datasets.filter(d => deburrUpper(d.name).includes(deburrUpper(search)))
      : null)
);

export const mapStateToProps = createStructuredSelector({
  datasets: getFilteredDatasets,
  search: selectSearch
});
