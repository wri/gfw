import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent } from 'services/forest-data';
import { getArea } from 'services/total-area';

const setTreeCoverLoading = createAction('setTreeCoverLoading');
const setTreeCoverData = createAction('setTreeCoverData');
const setTreeCoverSettingsIndicator = createAction(
  'setTreeCoverSettingsIndicator'
);
const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
const setTreeCoverSettingsThreshold = createAction(
  'setTreeCoverSettingsThreshold'
);

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
              const totalIntactForest = totalCover;
              dispatch(
                setTreeCoverData({
                  isLoading: false,
                  totalArea,
                  totalCover,
                  totalNonForest,
                  totalIntactForest
                })
              );
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

export default {
  setTreeCoverLoading,
  setTreeCoverData,
  getTreeCover,
  setTreeCoverSettingsIndicator,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsThreshold
};
