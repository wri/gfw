import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setConfirmSubscriptionModalSettings = createThunkAction(
  'setConfirmSubscriptionModalSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'confirmSubscription',
        change,
        state
      })
    )
);
