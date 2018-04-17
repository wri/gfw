import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchExtentRanked } from 'services/forest-data';

const setTreeCoverRankedLoading = createAction('setTreeCoverRankedLoading');
const setTreeCoverRankedData = createAction('setTreeCoverRankedData');
const setTreeCoverRankedSettings = createAction('setTreeCoverRankedSettings');

const getTreeCoverRanked = createThunkAction(
  'getTreeCoverRanked',
  params => (dispatch, state) => {
    if (!state().widgetTreeCoverRanked.loading) {
      dispatch(setTreeCoverRankedLoading({ loading: true, error: false }));
      fetchExtentRanked(params)
        .then(response => {
          const { data } = response.data;
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(item => {
              const area = item.total_area || 0;
              const extent = item.value || 0;
              return {
                id: item.iso,
                extent,
                area,
                percentage: extent ? 100 * extent / area : 0
              };
            });
          }
          dispatch(setTreeCoverRankedData({ extent: mappedData }));
        })
        .catch(error => {
          console.info(error);
          dispatch(setTreeCoverRankedLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setTreeCoverRankedLoading,
  setTreeCoverRankedData,
  setTreeCoverRankedSettings,
  getTreeCoverRanked
};
