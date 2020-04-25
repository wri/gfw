import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'app/stateToUrl';

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
