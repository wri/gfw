import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setAreaOfInterestModalSettings = createThunkAction(
  'setAreaOfInterestModalSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'areaOfInterestModal',
        change,
        state
      })
    )
);
