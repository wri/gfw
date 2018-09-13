import { createStructuredSelector } from 'reselect';

import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
  getActiveDatasetsState
} from 'components/map-v2/selectors';
import { getShowDraw } from 'pages/map/components/data-analysis-menu/selectors';

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsState
});
