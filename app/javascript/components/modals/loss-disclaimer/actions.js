import { createAction, createThunkAction } from 'redux-tools';

export const setModalTCLDisclaimerOpen = createAction(
  'setModalTCLDisclaimerOpen'
);

export const setModalTCLDislaimer = createThunkAction(
  'setModalTCLDislaimer',
  () => dispatch => {
    localStorage.setItem('tclDislaimerModalHidden', true);
    dispatch(setModalTCLDisclaimerOpen(false));
  }
);
