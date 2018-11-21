import { createAction, createThunkAction } from 'redux-tools';
import axios from 'axios';
import moment from 'moment';

import {
  fetchGLADLatest,
  fetchFormaLatest,
  fetchTerraiLatest,
  fetchSADLatest,
  fetchGranChacoLatest
} from 'services/alerts';

export const setLatestLoading = createAction('setLatestLoading');
export const setLatest = createAction('setLatest');

const layersBySlug = {
  forma250gfw: '66203fea-2e58-4a55-b222-1dae075cf95d',
  'glad-alerts': 'dd5df87f-39c2-4aeb-a462-3ef969b20b66',
  'terrai-alerts': '790b46ce-715a-4173-8f2c-53980073acb6',
  'imazon-latest': '3ec29734-4627-45b1-b320-680e4b4b939e',
  'guira-latest': 'c8829d15-e68a-4cb5-98a8-d0acff438a56'
};

export const getLatest = createThunkAction(
  'getLatest',
  latestEndpoints => dispatch => {
    axios
      .all(latestEndpoints)
      .then(
        axios.spread(latestDatesResponses => {
          console.log(latestDatesResponses);
          // parse latest dates from layers
          // const latestDates = latestDatesResponses && latestDatesResponses.reduce((obj, latest) => {
          //   const response = latest.data.data;
          //   const type = Array.isArray(response)
          //     ? response[0].type
          //     : response.type;
          //   const data = Array.isArray(response)
          //     ? response[0].attributes
          //     : response.attributes;
          //   const layerId = layersBySlug[type];
          //   return {
          //     ...obj,
          //     [layerId]: moment(data.date || data.latest).format('YYYY-MM-DD')
          //   };
          // }, {});

          // dispatch(setLatest());
        })
      )
      .catch(err => {
        dispatch(setLatestLoading({ loading: false, error: true }));
        console.warn(err);
      });
  }
);
