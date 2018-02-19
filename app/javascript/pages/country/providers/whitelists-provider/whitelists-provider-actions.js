import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import groupBy from 'lodash/groupBy';

import {
  getCountryWhitelistProvider,
  getRegionWhitelistProvider,
  getWaterBodiesBlacklistProvider
} from 'services/whitelists';

export const setCountryWhitelistLoading = createAction(
  'setCountryWhitelistLoading'
);
export const setRegionWhitelistLoading = createAction(
  'setRegionWhitelistLoading'
);
export const setWaterBodiesWhitelistLoading = createAction(
  'setWaterBodiesWhitelistLoading'
);

export const setCountryWhitelist = createAction('setCountryWhitelist');
export const setRegionWhitelist = createAction('setRegionWhitelist');
export const setWaterBodiesWhitelist = createAction('setWaterBodiesWhitelist');

export const getCountryWhitelist = createThunkAction(
  'getCountryWhitelist',
  country => (dispatch, state) => {
    if (!state().whitelists.countryWhitelistLoading) {
      dispatch(setCountryWhitelistLoading(true));
      getCountryWhitelistProvider(country)
        .then(response => {
          const data = {};
          if (response.data && response.data.data.length) {
            response.data.data.forEach(d => {
              data[d.polyname] = {
                extent_2000: d.total_extent_2000,
                extent_2010: d.total_extent_2010,
                loss: d.total_loss,
                gain: d.total_gain
              };
            });
          }
          dispatch(setCountryWhitelist(data));
        })
        .catch(error => {
          dispatch(setCountryWhitelistLoading(false));
          console.info(error);
        });
    }
  }
);

export const getRegionWhitelist = createThunkAction(
  'getRegionWhitelist',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().whitelists.regionWhitelistLoading) {
      dispatch(setRegionWhitelistLoading(true));
      getRegionWhitelistProvider(country, region, subRegion)
        .then(response => {
          const data = {};
          if (response.data && response.data.data.length) {
            response.data.data.forEach(d => {
              data[d.polyname] = {
                extent_2000: d.total_extent_2000,
                extent_2010: d.total_extent_2010,
                loss: d.total_loss,
                gain: d.total_gain
              };
            });
          }
          dispatch(setRegionWhitelist(data));
        })
        .catch(error => {
          dispatch(setRegionWhitelistLoading(false));
          console.info(error);
        });
    }
  }
);

export const getWaterBodiesWhitelist = createThunkAction(
  'getWaterBodiesWhitelist',
  () => dispatch => {
    getWaterBodiesBlacklistProvider()
      .then(response => {
        let data = [];
        if (response.data && response.data.rows.length) {
          data = groupBy(response.data.rows, 'iso');
        }
        dispatch(setWaterBodiesWhitelist(data));
      })
      .catch(error => {
        dispatch(setWaterBodiesWhitelistLoading(false));
        console.info(error);
      });
  }
);
