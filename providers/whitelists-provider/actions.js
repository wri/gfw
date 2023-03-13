import { all, spread } from 'axios';
import { createAction, createThunkAction } from 'redux/actions';

import { getLocationPolynameWhitelist } from 'services/analysis-cached';

export const setWhitelistLoading = createAction('setWhitelistLoading');

export const setWhitelist = createAction('setWhitelist');

const parseWhitelist = (whitelist) =>
  whitelist
    ? Object.keys(whitelist).reduce(
        (arr, item) => (whitelist[item] ? arr.concat(item) : arr),
        []
      )
    : [];

export const getWhitelist = createThunkAction(
  'getWhitelist',
  (params) => (dispatch) => {
    dispatch(setWhitelistLoading(true));
    all([
      getLocationPolynameWhitelist({ ...params, dataset: 'annual' }).catch(
        () => null
      ),
      getLocationPolynameWhitelist({ ...params, dataset: 'glad' }).catch(
        () => null
      ),
      getLocationPolynameWhitelist({ ...params, dataset: 'viirs' }).catch(
        () => null
      ),
      getLocationPolynameWhitelist({ ...params, dataset: 'modis' }).catch(
        () => null
      ),
    ])
      .then(
        // spread((annualResponse, gladResponse, viirsResponse, modisResponse) => {
        spread((annualResponse) => {
          dispatch(
            setWhitelist({
              // TODO: re-activate reponses
              // glad: parseWhitelist(gladResponse?.data?.[0]),
              // viirs: parseWhitelist(viirsResponse.data?.[0]),
              // modis: parseWhitelist(modisResponse?.data?.[0]),
              annual: parseWhitelist(annualResponse?.data?.[0]),
            })
          );
        })
      )
      .catch(() => {
        dispatch(setWhitelistLoading(false));
      });
  }
);
