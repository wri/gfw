import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalPlanetNoticeOpen = createThunkAction(
  'setModalPlanetNoticeOpen',
  isOpen => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'planetNotice',
        change: isOpen,
        state
      })
    );
  }
);
