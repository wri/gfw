import { createStructuredSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getDrawing
} from 'components/map/selectors';
import {
  getShowDraw,
  getAllBoundaries,
  getActiveBoundaryDatasets
} from 'components/analysis/selectors';

export const selectError = state => state.analysis && state.analysis.error;
export const selectErrorMessage = state =>
  state.analysis && state.analysis.errorMessage;
const selectUploading = state => state.analysis && state.analysis.uploading;

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  error: selectError,
  errorMessage: selectErrorMessage,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsFromState,
  drawing: getDrawing,
  uploading: selectUploading
});
