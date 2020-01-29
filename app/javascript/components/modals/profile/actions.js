import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setProfileSettings = createThunkAction(
  'setProfileSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'profile',
        change,
        state
      })
    )
);
