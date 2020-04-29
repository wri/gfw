import { all, spread } from 'axios';
import { createAction, createThunkAction } from 'utils/redux';
import uniq from 'lodash/uniq';

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
      getLocationPolynameWhitelist({ ...params, dataset: 'annual' }),
      getLocationPolynameWhitelist({ ...params, dataset: 'glad' }),
      getLocationPolynameWhitelist({ ...params, dataset: 'viirs' }),
      getLocationPolynameWhitelist({ ...params, dataset: 'modis' })
    ])
      .then(
        spread((annualResponse, gladResponse, viirsResponse, modisResponse) => {
          const annual =
            annualResponse &&
            annualResponse.data &&
            annualResponse.data.data[0];
          const glad =
            gladResponse && gladResponse.data && gladResponse.data.data[0];
          const viirs =
            viirsResponse && viirsResponse.data && viirsResponse.data.data[0];
          const modis =
            modisResponse && modisResponse.data && modisResponse.data.data[0];

          dispatch(
            setWhitelist({
              annual: parseWhitelist(annual),
              glad: parseWhitelist(glad),
              viirs: parseWhitelist(viirs),
              modis: parseWhitelist(modis),
              fires: uniq(parseWhitelist(viirs).concact(parseWhitelist(modis)))
            })
          );
        })
      )
      .catch(error => {
        dispatch(setWhitelistLoading(false));
        console.info(error);
      });
  }
);
