import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { fetchGadmArea } from 'services/gadm-area';

const setLoading = createAction('setLoading');

const setGadmCountryArea = createAction('setGadmCountryArea');
const setGadmRegionArea = createAction('setGadmRegionArea');
const setGadmSubRegionArea = createAction('setGadmSubRegionArea');

export const getGadmArea = createThunkAction(
  'getGadmArea',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().gadmAreas.isLoading) {
      dispatch(setLoading(true));
      fetchGadmArea(country, region, subRegion)
        .then(response => {
          if (subRegion) {
            dispatch(setGadmSubRegionArea(response.data.rows[0].value));
          } else if (region) {
            dispatch(setGadmRegionArea(response.data.rows[0].value));
          } else {
            dispatch(setGadmCountryArea(response.data.rows[0].value));
          }
          dispatch(setLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setLoading(false));
        });
    }
  }
);
