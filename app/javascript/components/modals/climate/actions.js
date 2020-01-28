import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalGFWClimateOpen = createThunkAction(
  'setModalGFWClimateOpen',
  isOpen => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'gfwclimate',
        change: isOpen,
        state
      })
    );
  }
);
