import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapSettings = createThunkAction(
  'setMapSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'map',
        change,
        state
      })
    );
  }
);

export default {
  setMapSettings
};
