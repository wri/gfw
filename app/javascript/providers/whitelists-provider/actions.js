import { all, spread } from 'axios';
import { createAction, createThunkAction } from 'utils/redux';

import { getLocationPolynameWhitelist } from 'services/analysis-cached';

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
  params => dispatch => {
    dispatch(setWhitelistLoading(true));
    all([
      getLocationPolynameWhitelist(params).catch(() => null),
      getLocationPolynameWhitelist({ ...params, glad: true }).catch(() => null)
      // adding a .catch that returns null after each request allows us to work with nulls in the `then`
      // instead of going to the catch when a single fetch fails
    ]).then(
      spread((annualResponse, gladResponse) => {
        const annual =
          annualResponse && annualResponse.data && annualResponse.data.data[0];
        const glad =
          gladResponse && gladResponse.data && gladResponse.data.data[0];

        dispatch(
          setWhitelist({
            annual: parseWhitelist(annual),
            glad: parseWhitelist(glad)
          })
        );
      })
    );
  }
);
