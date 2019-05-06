import { createSelector, createStructuredSelector } from 'reselect';

import { getShowAnalysis, getHideLegend, getEmbed } from 'pages/map/selectors';
import { getActiveSection } from 'components/map-menu/selectors';

import layersIcon from 'assets/icons/layers.svg';
import analysisIcon from 'assets/icons/analysis.svg';

export const getMenuLinks = createSelector([getShowAnalysis], showAnalysis => [
  {
    label: 'LEGEND',
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

export const getFilteredMenuLinks = createSelector(
  [getMenuLinks, getEmbed],
  (links, embed) => {
    if (embed) return links.filter(l => l.active);
    return links;
  }
);

export const getDataAnalysisMenuProps = createStructuredSelector({
  showAnalysis: getShowAnalysis,
  menuSection: getActiveSection,
  links: getFilteredMenuLinks,
  hidden: getHideLegend
});
