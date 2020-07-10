import { createAction, createThunkAction } from 'utils/redux';

export const setModalWelcomeOpen = createAction('setModalWelcomeOpen');

const isServer = typeof window === 'undefined';

export const setModalWelcome = createThunkAction(
  'setModalWelcome',
  () => dispatch => {
    if (!isServer) {
      localStorage.setItem('welcomeModalHidden', true);
    }
    dispatch(setModalWelcomeOpen(false));
  }
);

export const setExploreView = createThunkAction(
  'setExploreView',
  () => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
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
    const { query, type, payload } = getState().location || {};
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
