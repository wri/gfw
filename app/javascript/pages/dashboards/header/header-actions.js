import { createAction, createThunkAction } from 'redux-tools';
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
        getExtent({ ...params, forestType: 'plantations' }),
        getLoss(params),
        getLoss({ ...params, forestType: 'plantations' }),
        getLoss({ ...params, forestType: 'primary_forest' })
      ])
      .then(
        axios.spread(
          (
            totalExtent,
            totalPlantationsExtent,
            totalLoss,
            totalPlantationsLoss,
            totalPrimaryLoss
          ) => {
            const extent = totalExtent.data.data;
            const loss = totalLoss.data.data;
            const plantationsLoss = totalPlantationsLoss.data.data;
            const plantationsExtent = totalPlantationsExtent.data.data;

            // group over years
            const groupedLoss = loss && groupBy(loss, 'year');
            const groupedPlantationsLoss =
              plantationsLoss && groupBy(plantationsLoss, 'year');
            const groupedPlantationsExtent =
              plantationsExtent && groupBy(plantationsExtent, 'year');

            const primaryLoss = totalPrimaryLoss.data.data;
            const latestYear = max(Object.keys(groupedLoss));

            // sum over different bound1 within year
            const summedPlantationsLoss =
              groupedPlantationsLoss &&
              sumBy(groupedPlantationsLoss[latestYear], 'area');
            const summedPlantationsEmissions =
              groupedPlantationsLoss &&
              sumBy(groupedPlantationsLoss[latestYear], 'emissions');
            const summedPlantationsExtent =
              groupedPlantationsExtent &&
              sumBy(groupedPlantationsExtent[latestYear], 'area');
            const summedLoss = sumBy(groupedLoss[latestYear], 'area');
            const summedEmissions = sumBy(groupedLoss[latestYear], 'emissions');
            const data = {
              totalArea: (extent[0] && extent[0].total_area) || 0,
              extent: (extent[0] && extent[0].value) || 0,
              plantationsExtent: summedPlantationsExtent || 0,
              totalLoss: {
                area: summedLoss || 0,
                year: latestYear || 0,
                emissions: summedEmissions || 0
              },
              plantationsLoss: {
                area: summedPlantationsLoss || 0,
                emissions: summedPlantationsEmissions || 0
              },
              primaryLoss:
                primaryLoss && primaryLoss.length
                  ? reverse(sortBy(primaryLoss, 'year'))[0]
                  : {}
            };
            dispatch(setHeaderData(data));
          }
        )
      )
      .catch(error => {
        dispatch(setHeaderLoading({ loading: false, error: true }));
        console.info(error);
      });
  }
);

export const handleLocationChange = createThunkAction(
  'handleLocationChange',
  location => (dispatch, getState) => {
    const { query, type } = getState().location;
    const newQuery = {};

    if (query) {
      Object.keys(query).forEach(key => {
        const queryObj = query[key] || {};
        if (typeof queryObj === 'object') {
          const { forestType, landCategory, page } = queryObj;
          newQuery[key] = {
            ...queryObj,
            ...(forestType && {
              forestType: ''
            }),
            ...(landCategory && {
              landCategory: ''
            }),
            ...(page && {
              page: 0
            })
          };
        } else {
          newQuery[key] = queryObj;
        }
      });
    }

    dispatch({
      type,
      payload: {
        type: location.adm0 ? 'country' : 'global',
        ...location
      },
      query: {
        ...newQuery,
        widget: undefined
      }
    });
  }
);
