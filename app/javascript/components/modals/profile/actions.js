import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'app/stateToUrl';

export const setProfileModalOpen = createThunkAction(
  'setProfileModalOpen',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'profile',
        change,
        state
      })
    )
);
