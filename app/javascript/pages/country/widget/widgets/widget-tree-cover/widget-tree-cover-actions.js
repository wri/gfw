import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';

const setTreeCoverLoading = createAction('setTreeCoverLoading');
const setTreeCoverData = createAction('setTreeCoverData');
const setTreeCoverSettings = createAction('setTreeCoverSettings');

export const getTreeCover = createThunkAction(
  'getTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetTreeCover.isLoading) {
      dispatch(setTreeCoverLoading(true));
      getExtent(params)
        .then(response => {
          const totalArea = response.data.data[0].total_area;
          const cover = response.data.data[0].value;
          if (params.indicator !== 'gadm28') {
            dispatch(
              setTreeCoverData({
                totalArea,
                cover,
                plantations: 0
              })
            );
          } else {
            getExtent({ ...params, indicator: 'plantations' }).then(
              plantationsResponse => {
                const plantations = plantationsResponse.data.data[0].value;
                dispatch(
                  setTreeCoverData({
                    totalArea,
                    cover,
                    plantations
                  })
                );
              }
            );
          }
        })
        .catch(error => {
          dispatch(setTreeCoverLoading(false));
          console.info(error);
        });
    }
  }
);

export default {
  setTreeCoverLoading,
  setTreeCoverData,
  getTreeCover,
  setTreeCoverSettings
};
