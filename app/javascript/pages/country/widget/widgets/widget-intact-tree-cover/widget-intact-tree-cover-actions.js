import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';

const setIntactTreeCoverLoading = createAction('setIntactTreeCoverLoading');
const setIntactTreeCoverData = createAction('setIntactTreeCoverData');
const setIntactTreeCoverSettings = createAction('setIntactTreeCoverSettings');

export const getIntactTreeCover = createThunkAction(
  'getIntactTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetIntactTreeCover.loading) {
      dispatch(setIntactTreeCoverLoading({ loading: true, error: false }));
      getExtent(params)
        .then(response => {
          const extent = response.data && response.data.data;
          let totalArea = 0;
          let cover = 0;
          let plantations = 0;
          let data = {};
          if (extent.length) {
            totalArea = extent[0].total_area;
            cover = extent[0].value;
            data = {
              totalArea,
              cover,
              plantations
            };
          }
          if (params.indicator !== 'gadm28') {
            dispatch(setIntactTreeCoverData(data));
          } else {
            getExtent({ ...params, indicator: 'plantations' }).then(
              plantationsResponse => {
                const plantationsData =
                  plantationsResponse.data && plantationsResponse.data.data;
                plantations = plantationsData.length
                  ? plantationsData[0].value
                  : 0;
                if (extent.length) {
                  data = {
                    ...data,
                    plantations
                  };
                }
                dispatch(setIntactTreeCoverData(data));
              }
            );
          }
        })
        .catch(error => {
          dispatch(setIntactTreeCoverLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export default {
  setIntactTreeCoverLoading,
  setIntactTreeCoverData,
  getIntactTreeCover,
  setIntactTreeCoverSettings
};
