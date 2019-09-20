import { createAction, createThunkAction } from 'redux-tools';

import { getLocationPolynameWhitelist } from 'services/forest-data';

export const setWhitelistLoading = createAction('setWhitelistLoading');

export const setWhitelist = createAction('setWhitelist');

export const getWhitelist = createThunkAction(
  'getWhitelist',
  params => dispatch => {
    dispatch(setWhitelistLoading(true));
    getLocationPolynameWhitelist(params)
      .then(response => {
        const { rows } = (response && response.data) || {};
        const whitelistObject = rows && rows[0];
        const whitelist = whitelistObject
          ? Object.keys(whitelistObject).reduce(
            (arr, item) =>
              (whitelistObject[item] > 0 ? arr.concat(item) : arr),
            []
          )
          : [];
        dispatch(setWhitelist(whitelist));
      })
      .catch(error => {
        dispatch(setWhitelistLoading(false));
        console.info(error);
      });
  }
);
