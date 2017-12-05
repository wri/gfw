import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';
import { getArea } from 'services/total-area';

const setAreaLoading = createAction('setAreaLoading');
const setExtentLoading = createAction('setExtentLoading');

export const setCountryArea = createAction('setCountryArea');
export const setRegionArea = createAction('setRegionArea');
export const setSubRegionArea = createAction('setSubRegionArea');

export const setTreeCoverExtent = createAction('setTreeCoverExtent');

export const getTotalArea = createThunkAction(
  'getTotalArea',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().header.isAreaLoading) {
      dispatch(setAreaLoading(true));
      getArea(country, region, subRegion)
        .then(response => {
          if (subRegion) {
            dispatch(setSubRegionArea(response.data.rows[0].value));
          } else if (region) {
            dispatch(setRegionArea(response.data.rows[0].value));
          } else {
            dispatch(setCountryArea(response.data.rows[0].value));
          }
          dispatch(setAreaLoading(false));
        })
        .catch(error => {
          dispatch(setAreaLoading(false));
          console.info(error);
        });
    }
  }
);

export const getTreeCoverExtent = createThunkAction(
  'getTreeCoverExtent',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().header.isLoading) {
      dispatch(setExtentLoading(true));
      getExtent(country, region, subRegion, 'gadm28', 30)
        .then(response => {
          dispatch(setTreeCoverExtent(response.data.data[0].value));
          dispatch(setExtentLoading(false));
        })
        .catch(error => {
          dispatch(setExtentLoading(false));
          console.info(error);
        });
    }
  }
);
