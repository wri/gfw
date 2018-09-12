import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMenuSettings = createThunkAction(
  'setMenuSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'menu',
        change,
        state
      })
    );
  }
);
