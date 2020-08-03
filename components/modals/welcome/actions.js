import { createAction, createThunkAction } from 'redux/actions';

import { setMenuSettings } from 'components/map-menu/actions';
import { setAnalysisSettings } from 'components/analysis/actions';

export const setModalWelcomeOpen = createAction('setModalWelcomeOpen');

const isServer = typeof window === 'undefined';

export const setModalWelcome = createThunkAction(
  'setModalWelcome',
  () => (dispatch) => {
    if (!isServer) {
      localStorage.setItem('welcomeModalHidden', true);
    }
    dispatch(setModalWelcomeOpen(false));
  }
);

export const setExploreView = createThunkAction(
  'setExploreView',
  () => (dispatch) => {
    dispatch(setModalWelcome(false));
    dispatch(
      setMenuSettings({
        menuSection: 'explore',
      })
    );
  }
);

export const setAnalysisView = createThunkAction(
  'setAnalysisView',
  () => (dispatch) => {
    dispatch(setModalWelcome(false));
    dispatch(
      setAnalysisSettings({
        showAnalysis: true,
      })
    );
  }
);
