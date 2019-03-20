import { createStructuredSelector } from 'reselect';

import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getActiveDatasetsFromState,
  getDrawing
} from 'components/map/selectors';
import { getShowDraw } from 'components/map/components/analysis/selectors';

export const selectError = state => state.analysis && state.analysis.error;
export const selectErrorMessage = state =>
  state.analysis && state.analysis.errorMessage;

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  error: selectError,
  errorMessage: selectErrorMessage,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsFromState,
  drawing: getDrawing
});
