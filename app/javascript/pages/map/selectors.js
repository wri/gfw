import { createStructuredSelector } from 'reselect';

import { getMapSettings } from 'components/map-v2/selectors';

const getAnalysis = state => state.analysis.analysis;

export const getPageProps = createStructuredSelector({
  analysis: getAnalysis,
  mapSettings: getMapSettings
});
