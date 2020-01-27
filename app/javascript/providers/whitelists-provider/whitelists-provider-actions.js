import { createAction, createThunkAction } from 'utils/redux';
import axios from 'axios';

import { getLocationPolynameWhitelist } from 'services/forest-data-old';

export const setWhitelistLoading = createAction('setWhitelistLoading');

export const setWhitelist = createAction('setWhitelist');

const parseWhitelist = whitelist =>
  (whitelist
    ? Object.keys(whitelist).reduce(
      (arr, item) => (whitelist[item] ? arr.concat(item) : arr),
      []
    )
    : []);

export const getWhitelist = createThunkAction(
  'getWhitelist',
  ({ adm0, adm1, adm2 }) => (dispatch, getState) => {
    const { whitelists } = getState();
    if (whitelists && !whitelists.loading) {
      dispatch(setWhitelistLoading(true));
      axios
        .all([
          getLocationPolynameWhitelist({ adm0, adm1, adm2 }),
          getLocationPolynameWhitelist({ adm0, adm1, adm2, glad: true })
        ])
        .then(
          axios.spread((annualResponse, gladResponse) => {
            const annual =
              annualResponse &&
              annualResponse.data &&
              annualResponse.data.rows[0];
            const glad =
              gladResponse && gladResponse.data && gladResponse.data.rows[0];

            dispatch(
              setWhitelist({
                annual: parseWhitelist(annual),
                glad: parseWhitelist(glad)
              })
            );
          })
        )
        .catch(error => {
          dispatch(setWhitelistLoading(false));
          console.info(error);
        });
    }
  }
);
