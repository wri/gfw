import { createSelector, createStructuredSelector } from 'reselect';
import { getRouter } from 'utils/withRouter';

import {
  getDrawing,
  getMapLoading,
  getActiveDatasetsFromState,
  getInteractionSelected
} from 'components/map/selectors';
import { getShowDraw } from 'components/analysis/selectors';

import { initialState } from './reducers';

// state from url
const selectMainMapUrlState = state => state?.mainMap;
const selectLocation = () => getRouter()?.pathname;
const selectLocationPayload = () => getRouter()?.location;
const selectMenuSection = state => state?.menu?.menuSection;
const getDrawGeostoreId = state => state.draw && state.draw.geostoreId;

// SELECTORS
export const getEmbed = createSelector(
  [selectLocation],
  location => location?.includes('embed')
);

export const getMainMapSettings = createSelector(
  [selectMainMapUrlState],
  urlState => ({
    ...initialState,
    ...urlState
  })
);

export const getHidePanels = createSelector(
  getMainMapSettings,
  settings => settings.hidePanels
);

export const getShowBasemaps = createSelector(
  getMainMapSettings,
  settings => settings.showBasemaps
);

export const getShowRecentImagery = createSelector(
  getMainMapSettings,
  settings => settings.showRecentImagery
);

export const getHideLegend = createSelector(
  getMainMapSettings,
  settings => settings.hideLegend
);

export const getShowAnalysis = createSelector(
  getMainMapSettings,
  settings => settings.showAnalysis
);

export const getOneClickAnalysis = createSelector(
  [
    getShowDraw,
    selectLocationPayload,
    getDrawing,
    getMapLoading,
    getShowAnalysis
  ],
  (showDraw, location, draw, loading, showAnalysis) => {
    const hasLocation = !!location?.adm0;
    const isDrawing = draw || showDraw;
    return !hasLocation && !isDrawing && !loading && showAnalysis;
  }
);

export default createStructuredSelector({
  analysisActive: getShowAnalysis,
  recentActive: getShowRecentImagery,
  oneClickAnalysis: getOneClickAnalysis,
  hidePanels: getHidePanels,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  geostoreId: getDrawGeostoreId,
  selectedInteraction: getInteractionSelected,
  location: selectLocationPayload
});
