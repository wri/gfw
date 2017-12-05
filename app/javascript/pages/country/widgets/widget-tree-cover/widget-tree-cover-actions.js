import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';
import { getArea } from 'services/total-area';

const setTreeCoverLoading = createAction('setTreeCoverLoading');
const setTreeCoverData = createAction('setTreeCoverData');
const setCoverCountryArea = createAction('setCoverCountryArea');
const setCoverRegionArea = createAction('setRegionArea');
const setCoverSubRegionArea = createAction('setSubRegionArea');

// const setTreeCoverSettingsLocation = createAction(
//   'setTreeCoverSettingsLocation'
// );
// const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
// const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
// const setLayers = createAction('setLayers');

export const getTreeCover = createThunkAction(
  'getTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetTreeCover.isLoading) {
      dispatch(setTreeCoverLoading(true));
      getExtent(params)
        .then(treeCoverResponse => {
          getArea(params)
            .then(areaResponse => {
              const totalArea = areaResponse.data.rows[0].value;
              const totalCover = treeCoverResponse.data.data[0].value;
              const totalNonForest = totalArea - totalCover;
              dispatch(setTreeCoverData({
                isLoading: false,
                totalCover,
                totalNonForest
              }));
            })
            .catch(error => {
              console.info(error);
            });
        })
        .catch(error => {
          dispatch(setTreeCoverLoading(false));
          console.info(error);
        });
    }
  }
);

export const getCoverTotalArea = createThunkAction(
  'getCoverTotalArea',
  params => dispatch => {
    getArea(params)
      .then(response => {
        if (params.subRegion) {
          dispatch(setCoverSubRegionArea(response.data.rows[0].value));
        } else if (params.region) {
          dispatch(setCoverRegionArea(response.data.rows[0].value));
        } else {
          dispatch(setCoverCountryArea(response.data.rows[0].value));
        }
      })
      .catch(error => {
        console.info(error);
      });
  }
);

export default {
  setTreeCoverData,
  getTreeCover,
  getCoverTotalArea,
  setCoverCountryArea,
  setCoverRegionArea,
  setCoverSubRegionArea
};
