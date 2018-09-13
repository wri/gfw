import { createStructuredSelector } from 'reselect';

import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getActiveDatasetsState
} from 'components/map-v2/selectors';
import { getShowDraw } from 'pages/map/components/data-analysis-menu/selectors';

export const selectQuery = state => state.location && state.location.query;
export const selectError = state => state.analysis.error;
export const selectErrorMessage = state => state.analysis.errorMessage;

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  error: selectError,
  errorMessage: selectErrorMessage,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsState,
  query: selectQuery
});
