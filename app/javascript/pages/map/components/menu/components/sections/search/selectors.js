import { createSelector, createStructuredSelector } from 'reselect';
import { deburrUpper } from 'utils/data';
import { buildGadm36Id } from 'utils/format';
import sortBy from 'lodash/sortBy';

import { getActiveDatasetsState } from 'components/map-v2/selectors';

const selectSearch = state =>
  state.location &&
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.search;
const selectLocation = state =>
  (state.location && state.location.payload) || null;
const selectDatasets = state => state.datasets.datasets || null;
const selectLocations = state => state.mapMenu.locations || null;
const selectLoading = state => state.mapMenu.loading || null;

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
      ? datasets.filter(
        d =>
          deburrUpper(d.name).includes(deburrUpper(search)) ||
            deburrUpper(d.description).includes(deburrUpper(search))
      )
      : null)
);

const getLocations = createSelector(
  [selectLocations, selectLocation],
  (locations, location) => {
    if (!locations) return null;
    const { adm0, adm1, adm2 } = location;
    const gadmId = buildGadm36Id(adm0, adm1, adm2);

    return locations
      .map(l => ({
        ...l,
        active: Object.values(l).includes(gadmId)
      }))
      .slice(0, 15);
  }
);

export const mapStateToProps = createStructuredSelector({
  datasets: getFilteredDatasets,
  search: selectSearch,
  locations: getLocations,
  loading: selectLoading
});
