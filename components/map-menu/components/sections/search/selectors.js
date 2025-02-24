import { createSelector, createStructuredSelector } from 'reselect';
import { deburrUpper } from 'utils/strings';
import { getGadmId } from 'utils/gadm';
import sortBy from 'lodash/sortBy';
import { translateText, selectActiveLang } from 'utils/lang';

import { getActiveDatasetsFromState } from 'components/map/selectors';

const selectSearch = (state) => state.mapMenu?.settings?.search;
const selectLocation = (state) => state.location && state.location.payload;
const selectDatasets = (state) => state.datasets && state.datasets.data;
const selectLocations = (state) => state.mapMenu && state.mapMenu.locations;
const selectLoading = (state) => state.mapMenu && state.mapMenu.loading;

const getDatasetWithUrlState = createSelector(
  [getActiveDatasetsFromState, selectDatasets, selectActiveLang],
  (datasetsState, datasets, lang) => {
    const datasetIds = datasetsState.map((d) => d.dataset);

    return (
      datasets &&
      sortBy(
        datasets.map((d) => ({
          ...d,
          active: datasetIds.includes(d.id),
          localeName: lang === 'en' ? d.name : translateText(d.name),
        })),
        ['name', 'localName']
      )
    );
  }
);

const getFilteredDatasets = createSelector(
  [getDatasetWithUrlState, selectSearch, selectActiveLang],
  (datasets, search) =>
    search && datasets
      ? datasets.filter(
          (d) =>
            deburrUpper(d.name).includes(deburrUpper(search)) ||
            deburrUpper(d.localeName).includes(deburrUpper(search)) ||
            deburrUpper(d.description).includes(deburrUpper(search))
        )
      : null
);

const getLocations = createSelector(
  [selectLocations, selectLocation],
  (locations, location) => {
    if (!locations) return null;
    const { adm0, adm1, adm2 } = location;
    const gadmId = getGadmId(adm0, adm1, adm2);

    return locations
      .map((l) => ({
        ...l,
        active: l && Object.values(l)?.includes(gadmId),
      }))
      .slice(0, 15);
  }
);

export const mapStateToProps = createStructuredSelector({
  datasets: getFilteredDatasets,
  search: selectSearch,
  locations: getLocations,
  loading: selectLoading,
  lang: selectActiveLang,
});
