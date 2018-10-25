import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setSubscribeSettings = createThunkAction(
  'setSubscribeSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'subscribe',
        change,
        state
      })
    )
);
