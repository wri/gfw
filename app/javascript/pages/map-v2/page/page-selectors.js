import { createStructuredSelector } from 'reselect';

import { getMapSettings } from 'components/map-v2/selectors';

const getAnalysis = state => state.dataAnalysis.analysis;
const getLoggedIn = state => !!state.myGfw.data || null;

export const getPageProps = createStructuredSelector({
  analysis: getAnalysis,
  loggedIn: getLoggedIn,
  mapSettings: getMapSettings
});
