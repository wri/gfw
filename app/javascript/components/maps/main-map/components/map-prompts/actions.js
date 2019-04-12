import { createThunkAction, createAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setShowMapPrompts = createAction('setShowMapPrompts');

export const setMapPromptsData = createThunkAction(
  'setMapPromptsData',
  data => dispatch => {
    localStorage.setItem('mapPrompts', data);
    dispatch(setShowMapPrompts(data.showPrompts));
  }
);

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  change => (dispatch, state) => {
    const { data } = state().mapPrompts || {};
    const { promptsViewed } = data || {};
    if (
      change &&
      !change.stepsIndex &&
      promptsViewed &&
      promptsViewed.includes(change.stepsKey)
    ) {
      return false;
    }
    dispatch(
      setComponentStateToUrl({
        key: 'mapPrompts',
        change,
        state
      })
    );

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
