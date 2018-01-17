import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getLocations } from 'services/forest-data';

const setRelativeTreeCoverData = createAction('setRelativeTreeCoverData');
const setRelativeTreeCoverPage = createAction('setRelativeTreeCoverPage');
const setRelativeTreeCoverSettings = createAction(
  'setRelativeTreeCoverSettings'
);
const setRelativeTreeCoverLoading = createAction('setRelativeTreeCoverLoading');

const getRelativeTreeCover = createThunkAction(
  'getRelativeTreeCover',
  params => (dispatch, state) => {
    if (!state().widgetRelativeTreeCover.loading) {
      dispatch(setRelativeTreeCoverLoading({ loading: true, error: false }));
      getLocations(params)
        .then(response => {
          const { data } = response.data;
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(d => ({
              id: d.region,
              extent: d.extent || 0,
              percentage: d.extent ? d.extent / d.total * 100 : 0
            }));
          }
          dispatch(setRelativeTreeCoverData(mappedData));
        })
        .catch(error => {
          dispatch(
            setRelativeTreeCoverLoading({ loading: false, error: true })
          );
          console.error(error);
        });
    }
  }
);

export default {
  setRelativeTreeCoverData,
  setRelativeTreeCoverPage,
  setRelativeTreeCoverSettings,
  setRelativeTreeCoverLoading,
  getRelativeTreeCover
};
