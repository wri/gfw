import { createThunkAction, createAction } from 'redux/actions';
import { track } from 'analytics';
import useRouter from 'utils/router';

import { setMenuSettings } from 'components/map-menu/actions';
import { setMainMapSettings } from 'layouts/map/actions';

export const setShowMapPrompts = createAction('setShowMapPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');
export const setMapPrompts = createAction('setMapPrompts');

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  (change) => (dispatch, state) => {
    const { mapPrompts } = state() || {};
    const { promptsViewed, showPrompts } = mapPrompts || {};
    const { stepsKey, force, stepIndex } = change || {};

    if (
      force ||
      (showPrompts && (!promptsViewed || !promptsViewed.includes(stepsKey)))
    ) {
      dispatch(setMapPrompts(change));
      if (stepsKey) {
        track('userPrompt', {
          label: `${stepsKey}: ${(stepIndex || 0) + 1}`,
        });
      }
    }

    if (stepsKey && showPrompts) {
      dispatch(setShowPromptsViewed(stepsKey));
    }
  }
);

export const setExploreView = createThunkAction(
  'setExploreView',
  () => (dispatch) => {
    dispatch(
      setMenuSettings({
        menuSection: 'explore',
      })
    );
  }
);

export const setAnalysisView = createThunkAction(
  'setAnalysisView',
  (params) => () => {
    const { pathname, query, pushQuery } = useRouter();
    pushQuery({
      pathname,
      query: {
        ...query,
        location: Object.values(params),
        mainMap: {
          showAnalysis: true,
        },
      },
    });
  }
);

export const clearAnalysisView = createThunkAction(
  'clearAnalysisView',
  () => (dispatch) => {
    dispatch(
      setMainMapSettings({
        showAnalysis: true,
      })
    );
  }
);
