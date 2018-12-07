import { createAction, createThunkAction } from 'vizzuality-redux-tools';

export const setModalWelcome = createAction('setModalWelcome');

export const setExploreView = createThunkAction(
  'setExploreView',
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch(setModalWelcome(false));
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
    const { query, type, payload } = getState().location;
    dispatch(setModalWelcome(false));
    dispatch({
      type,
      payload,
      query: {
        ...query,
        analysis: {
          showAnalysis: true
        }
      }
    });
  }
);
