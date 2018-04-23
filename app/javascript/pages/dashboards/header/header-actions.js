import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getExtent, getLoss } from 'services/forest-data';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import axios from 'axios';

export const setHeaderLoading = createAction('setHeaderLoading');
export const setHeaderData = createAction('setHeaderData');

export const getHeaderData = createThunkAction(
  'getHeaderData',
  params => (dispatch, state) => {
    if (!state().header.loading) {
      dispatch(setHeaderLoading({ loading: true, error: false }));
      axios
        .all([
          getExtent(params),
          getLoss(params),
          getLoss({ ...params, indicator: 'plantations' })
        ])
        .then(
          axios.spread((totalExtent, totalLoss, plantationsLoss) => {
            const extent = totalExtent.data.data;
            const loss = totalLoss.data.data;
            const plantations = plantationsLoss.data.data;
            const data = {
              totalArea: (extent[0] && extent[0].total_area) || 0,
              extent: (extent[0] && extent[0].value) || 0,
              totalLoss:
                loss && loss.length ? reverse(sortBy(loss, 'year'))[0] : {},
              plantationsLoss:
                plantations && plantations.length
                  ? reverse(sortBy(plantations, 'year'))[0]
                  : {}
            };
            dispatch(setHeaderData(data));
          })
        )
        .catch(error => {
          dispatch(setHeaderLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);
