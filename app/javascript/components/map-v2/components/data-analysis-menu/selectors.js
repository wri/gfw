import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveSection } from 'pages/map/components/menu/menu-selectors';
import {
  getShowAnalysis,
  getHidden
} from 'components/map-v2/components/analysis/selectors';

import layersIcon from 'assets/icons/layers.svg';
import analysisIcon from 'assets/icons/analysis.svg';

export const getMenuLinks = createSelector([getShowAnalysis], showAnalysis => [
  {
    label: 'DATA',
    icon: layersIcon,
    active: !showAnalysis,
    showAnalysis: false
  },
  {
    label: 'ANALYSIS',
    icon: analysisIcon,
    active: showAnalysis,
    showAnalysis: true
  }
]);

export const getDataAnalysisMenuProps = createStructuredSelector({
  showAnalysis: getShowAnalysis,
  menuSection: getActiveSection,
  links: getMenuLinks,
  hidden: getHidden
});
