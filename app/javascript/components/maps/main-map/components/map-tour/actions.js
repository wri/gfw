import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapPromptsSettings = createThunkAction(
  'setMapPromptsSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'mapPrompts',
        change,
        state
      })
    )
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
