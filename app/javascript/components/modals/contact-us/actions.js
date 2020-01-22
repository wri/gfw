import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalContactUsOpen = createThunkAction(
  'setModalContactUsOpen',
  isOpen => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'contactUs',
        change: isOpen,
        state
      })
    );
  }
);
