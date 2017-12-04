import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/tree-extent';
import { fetchArea } from 'services/total-area';

const setAreaLoading = createAction('setAreaLoading');
const setExtentLoading = createAction('setExtentLoading');

const setCountryArea = createAction('setCountryArea');
const setRegionArea = createAction('setRegionArea');
const setSubRegionArea = createAction('setSubRegionArea');

const setTreeCoverExtent = createAction('setTreeCoverExtent');

export const getArea = createThunkAction(
  'getArea',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().headers.isAreaLoading) {
      dispatch(setAreaLoading(true));
      fetchArea(country, region, subRegion)
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
          console.info(error);
          dispatch(setAreaLoading(false));
        });
    }
  }
);

export const getTreeCoverExtent = createThunkAction(
  'getTreeCoverExtent',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().header.isLoading) {
      dispatch(setExtentLoading(true));
      getExtent(country, region, subRegion, 'gadm28_only', 30)
        .then(response => {
          dispatch(setTreeCoverExtent(response.data.rows));
          dispatch(setExtentLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setExtentLoading(false));
        });
    }
  }
);
