import { createThunkAction, createAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setShowMapPrompts = createAction('setShowMapPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  change => (dispatch, state) => {
    const { mapPrompts } = state() || {};
    const { promptsViewed } = mapPrompts || {};
    const { open, stepsKey, stepIndex } = change || {};

    // if (
    //   open &&
    //   !stepIndex &&
    //   promptsViewed &&
    //   promptsViewed.includes(stepsKey)
    // ) {
    //   return false;
    // }

    dispatch(
      setComponentStateToUrl({
        key: 'mapPrompts',
        change,
        state
      })
    );
    if (stepsKey) {
      dispatch(setShowPromptsViewed(stepsKey));
    }

    return true;
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
