import { createThunkAction, createAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setShowMapPrompts = createAction('setShowMapPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  change => (dispatch, state) => {
    const { mapPrompts } = state() || {};
    const { promptsViewed, showPrompts } = mapPrompts || {};
    const { stepsKey, force } = change || {};

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
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
    dispatch({
      type,
      payload,
      query: {
        ...query,
        mainMap: {
          showAnalysis: true
        }
      }
    });
  }
);
