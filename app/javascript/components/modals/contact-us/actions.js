import { createThunkAction } from 'utils/redux';
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
