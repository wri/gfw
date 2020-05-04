import { all, spread } from 'axios';
import { createAction, createThunkAction } from 'utils/redux';
import uniq from 'lodash/uniq';
import compact from 'lodash/compact';

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
      getLocationPolynameWhitelist({ ...params, dataset: 'viirs' }),
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
          const viirsList =
            viirsResponse && viirsResponse.data && viirsResponse.data.data[0];
          const modisList =
            modisResponse && modisResponse.data && modisResponse.data.data[0];

          const viirs = parseWhitelist(viirsList);
          const modis = parseWhitelist(modisList);
          const fires = compact(uniq(viirs ? viirs.concat(modis) : modis));

          dispatch(
            setWhitelist({
              annual: parseWhitelist(annual),
              glad: parseWhitelist(glad),
              viirs,
              modis,
              fires
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
