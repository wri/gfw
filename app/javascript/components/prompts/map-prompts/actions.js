import { createThunkAction, createAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { logEvent } from 'app/analytics';

export const setShowMapPrompts = createAction('setShowMapPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  change => (dispatch, state) => {
    const { mapPrompts } = state() || {};
    const { promptsViewed, showPrompts } = mapPrompts || {};
    const { stepsKey, force, stepIndex } = change || {};

    if (
      force ||
      (showPrompts && (!promptsViewed || !promptsViewed.includes(stepsKey)))
    ) {
      dispatch(
        setComponentStateToUrl({
          key: 'mapPrompts',
          change,
          state
        })
      );
      if (stepsKey) {
        logEvent('userPrompt', {
          label: `${stepsKey}: ${(stepIndex || 0) + 1}`
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
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
    dispatch({
      type,
      payload,
      query: {
        ...query,
        menu: {
          menuSection: 'explore'
        }
      }
    });
  }
);

export const setAnalysisView = createThunkAction(
  'setAnalysisView',
  params => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
    dispatch({
      type,
      payload: {
        ...payload,
        ...params
      },
      query: {
        ...query,
        mainMap: {
          showAnalysis: true
        }
      }
    });
  }
);

export const clearAnalysisView = createThunkAction(
  'clearAnalysisView',
  () => (dispatch, getState) => {
    const { query, type } = getState().location || {};
    dispatch({
      type,
      query: {
        ...query,
        mainMap: {
          showAnalysis: true
        }
      }
    });
  }
);
