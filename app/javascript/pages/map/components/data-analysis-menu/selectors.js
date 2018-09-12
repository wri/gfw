import { createStructuredSelector } from 'reselect';

import { getActiveSection } from 'pages/map/components/menu/menu-selectors';

const getLocation = state =>
  state.location.payload && state.location.payload.tab;
const getSearch = state => state.location.search;
const getAnalysis = state => state.dataAnalysis.analysis;

export const getAnalysisProps = createStructuredSelector({
  activeTab: getLocation,
  analysis: getAnalysis,
  menuSectionData: getActiveSection,
  search: getSearch
});
