import { createAction, createThunkAction } from 'redux/actions';
import { all, spread } from 'axios';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import isEmpty from 'lodash/isEmpty';
import max from 'lodash/max';
import reverse from 'lodash/reverse';

import { getExtent, getLoss } from 'services/analysis-cached';
import { getGeodescriberByGeoJson } from 'services/geodescriber';

export const setGeodescriberLoading = createAction('setGeodescriberLoading');
export const setGeodescriber = createAction('setGeodescriber');
export const clearGeodescriber = createAction('clearGeodescriber');

export const getGeodescriber = createThunkAction(
  'getGeodescriber',
  (params) => (dispatch) => {
    if (!isEmpty(params)) {
      dispatch(setGeodescriberLoading({ loading: true, error: false }));
      getGeodescriberByGeoJson({ ...params, template: true })
        .then((response) => {
          dispatch(setGeodescriber(response.data.data));
        })
        .catch(() => {
          dispatch(setGeodescriberLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getAdminStats = (params) =>
  all([
    getExtent(params),
    getExtent({ ...params, forestType: 'plantations' }),
    getExtent({
      ...params,
      forestType: 'primary_forest',
      extentYear: 2000,
    }),
    getLoss(params),
    getLoss({ ...params, forestType: 'plantations' }),
    getLoss({ ...params, forestType: 'primary_forest' }),
  ]).then(
    spread(
      (
        totalExtent,
        totalPlantationsExtent,
        totalPrimaryExtent,
        totalLoss,
        totalPlantationsLoss,
        totalPrimaryLoss
      ) => {
        const extent = totalExtent.data.data;
        const loss = totalLoss.data.data;
        const plantationsLoss = totalPlantationsLoss.data.data;
        const plantationsExtent = totalPlantationsExtent.data.data;
        const primaryExtent = totalPrimaryExtent.data.data;

        // group over years
        const groupedLoss = plantationsLoss && groupBy(loss, 'year');
        const groupedPlantationsLoss =
          plantationsLoss && groupBy(plantationsLoss, 'year');

        const primaryLoss = totalPrimaryLoss.data.data;
        const latestYear = max(Object.keys(groupedLoss));

        const latestPlantationLoss = groupedPlantationsLoss[latestYear] || null;
        const latestLoss = groupedLoss[latestYear] || null;

        // sum over different bound1 within year
        const summedPlantationsLoss =
          latestPlantationLoss &&
          latestPlantationLoss.length &&
          latestPlantationLoss[0].area
            ? sumBy(latestPlantationLoss, 'area')
            : 0;
        const summedPlantationsEmissions =
          latestPlantationLoss &&
          latestPlantationLoss.length &&
          latestPlantationLoss[0].emissions
            ? sumBy(latestPlantationLoss, 'emissions')
            : 0;
        const summedLoss =
          latestLoss && latestLoss.length && latestLoss[0].area
            ? sumBy(latestLoss, 'area')
            : 0;
        const summedEmissions =
          latestLoss && latestLoss.length && latestLoss[0].emissions
            ? sumBy(latestLoss, 'emissions')
            : 0;

        const data = {
          totalArea: extent.reduce((total, d) => total + d.total_area, 0) || 0,
          extent: extent.reduce((total, d) => total + d.extent, 0) || 0,
          plantationsExtent:
            plantationsExtent && plantationsExtent.length
              ? plantationsExtent.reduce((total, d) => total + d.extent, 0)
              : 0,
          primaryExtent:
            primaryExtent && primaryExtent.length
              ? primaryExtent.reduce((total, d) => total + d.extent, 0)
              : 0,
          totalLoss: {
            area: summedLoss || 0,
            year: latestYear || 0,
            emissions: summedEmissions || 0,
          },
          plantationsLoss: {
            area: summedPlantationsLoss || 0,
            emissions: summedPlantationsEmissions || 0,
          },
          primaryLoss:
            primaryLoss && primaryLoss.length
              ? reverse(sortBy(primaryLoss, 'year'))[0]
              : {},
        };

        return data;
      }
    )
  );

export const getAdminGeodescriber = createThunkAction(
  'getAdminGeodescriber',
  (location) => (dispatch) => {
    dispatch(setGeodescriberLoading({ loading: true, error: false }));
    getAdminStats({ ...location, threshold: 30, extentYear: 2010 })
      .then((response) => {
        dispatch(setGeodescriber(response));
      })
      .catch(() => {
        dispatch(setGeodescriberLoading({ loading: false, error: true }));
      });
  }
);
