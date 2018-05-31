import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent, getLoss } from 'services/forest-data';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import max from 'lodash/max';
import reverse from 'lodash/reverse';
import axios from 'axios';

export const setHeaderLoading = createAction('setHeaderLoading');
export const setHeaderData = createAction('setHeaderData');

export const getHeaderData = createThunkAction(
  'getHeaderData',
  params => dispatch => {
    dispatch(setHeaderLoading({ loading: true, error: false }));
    axios
      .all([
        getExtent(params),
        getLoss(params),
        getLoss({ ...params, forestType: 'plantations' })
      ])
      .then(
        axios.spread((totalExtent, totalLoss, plantationsLoss) => {
          const extent = totalExtent.data.data;
          const loss = totalLoss.data.data;
          const plantations = plantationsLoss.data.data;
          const groupedLoss = loss && groupBy(loss, 'year');
          const latestYear = max(Object.keys(groupedLoss));
          const summedLoss = sumBy(groupedLoss[latestYear], 'area');
          const summedEmissions = sumBy(groupedLoss[latestYear], 'emissions');
          const data = {
            totalArea: (extent[0] && extent[0].total_area) || 0,
            extent: (extent[0] && extent[0].value) || 0,
            totalLoss: {
              area: summedLoss,
              year: latestYear,
              emissions: summedEmissions
            },
            plantationsLoss:
              plantations && plantations.length
                ? reverse(sortBy(plantations, 'year'))[0]
                : {}
          };
          dispatch(setHeaderData(data));
        })
      )
      .catch(error => {
        dispatch(setHeaderLoading({ loading: false, error: true }));
        console.info(error);
      });
  }
);
