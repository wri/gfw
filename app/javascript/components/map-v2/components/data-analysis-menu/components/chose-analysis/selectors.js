import { createStructuredSelector } from 'reselect';

import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getActiveDatasetsState,
  getDraw
} from 'components/map-v2/selectors';
import { getShowDraw } from 'components/map-v2/components/data-analysis-menu/selectors';

export const selectError = state => state.analysis.error;
export const selectErrorMessage = state => state.analysis.errorMessage;

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  error: selectError,
  errorMessage: selectErrorMessage,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsState,
  draw: getDraw
});
