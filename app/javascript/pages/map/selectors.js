import { createStructuredSelector } from 'reselect';

import { getMapSettings } from 'components/map-v2/selectors';

const getAnalysis = state => state.dataAnalysis.analysis;

export const getPageProps = createStructuredSelector({
  analysis: getAnalysis,
  mapSettings: getMapSettings
});
