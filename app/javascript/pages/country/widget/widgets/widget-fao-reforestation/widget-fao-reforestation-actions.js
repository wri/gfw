import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getFAOExtent } from 'services/forest-data';

const setFAOReforestationLoading = createAction('setFAOReforestationLoading');
const setFAOReforestationData = createAction('setFAOReforestationData');
const setFAOReforestationSettings = createAction('setFAOReforestationSettings');

const getFAOReforestationData = createThunkAction(
  'getFAOReforestation',
  params => (dispatch, state) => {
    if (!state().widgetFAOReforestation.loading) {
      dispatch(setFAOReforestationLoading({ loading: true, error: false }));
      getFAOExtent({ ...params })
        .then(response => {
          const data = response.data.rows;
          let mappedData = {};
          const hasCountryData =
            (data.length &&
              data.find(d => d.iso === state().location.payload.country)) ||
            null;
          if (hasCountryData) {
            mappedData = { countries: data };
          }
          dispatch(setFAOReforestationData(mappedData));
        })
        .catch(error => {
          console.info(error);
          dispatch(setFAOReforestationLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setFAOReforestationLoading,
  setFAOReforestationData,
  setFAOReforestationSettings,
  getFAOReforestationData
};
