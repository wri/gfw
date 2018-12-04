import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveSection } from 'components/maps/components/menu/menu-selectors';
import {
  getShowAnalysis,
  getHidden
} from 'components/maps/components/analysis/selectors';

import layersIcon from 'assets/icons/layers.svg';
import analysisIcon from 'assets/icons/analysis.svg';

export const selectEmbed = (state, { embed }) => embed;

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
  [getMenuLinks, selectEmbed],
  (links, embed) => {
    if (embed) return links.filter(l => l.active);
    return links;
  }
);

export const getDataAnalysisMenuProps = createStructuredSelector({
  showAnalysis: getShowAnalysis,
  menuSection: getActiveSection,
  links: getFilteredMenuLinks,
  hidden: getHidden
});
