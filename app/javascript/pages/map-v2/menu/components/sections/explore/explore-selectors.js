import { createSelector, createStructuredSelector } from 'reselect';

import {
  getActiveDatasetsState,
  getBasemap,
  getLabels
} from 'components/map-v2/selectors';

import topics, { descriptions } from './explore-topics';

const selectSection = (state, props) => props.exploreSection;
const selectedData = state => ({
  topics: Object.values(topics),
  ...(state.mapMenu && state.mapMenu.data)
});

const getCardsData = createSelector(
  [selectSection, selectedData],
  (section, data) => {
    if (!data) return null;
    return data[section];
  }
);

const getDescription = createSelector(
  [selectSection],
  section => descriptions[section]
);

const getCurrentMapPayload = createSelector(
  [getActiveDatasetsState, getBasemap, getLabels],
  (datasets, basemap, label) => ({
    datasets,
    basemap,
    label
  })
);

export const mapStateToProps = createStructuredSelector({
  data: getCardsData,
  section: selectSection,
  description: getDescription,
  mapState: getCurrentMapPayload
});
