import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalNewsletterOpen = createThunkAction(
  'setModalNewsletterOpen',
  isOpen => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'newsletter',
        change: isOpen,
        state
      })
    );
  }
);
