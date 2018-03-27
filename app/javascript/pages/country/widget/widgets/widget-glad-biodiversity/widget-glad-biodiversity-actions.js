import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment';

import { fetchGladIntersectionAlerts } from 'services/alerts';
import { getMultiRegionExtent } from 'services/forest-data';

const setGladBiodiversityData = createAction('setGladBiodiversityData');
const setGladBiodiversityPage = createAction('setGladBiodiversityPage');
const setGladBiodiversitySettings = createAction('setGladBiodiversitySettings');
const setGladBiodiversityLoading = createAction('setGladBiodiversityLoading');

const getGladBiodiversity = createThunkAction(
  'getGladBiodiversity',
  params => (dispatch, state) => {
    if (!state().widgetGladBiodiversity.loading) {
      dispatch(setGladBiodiversityLoading({ loading: true, error: false }));

      axios
        .all([
          fetchGladIntersectionAlerts({ ...params }),
          getMultiRegionExtent({ ...params })
        ])
        .then(
          axios.spread((alerts, extent) => {
            const { data } = alerts.data;
            // const areas = extent.data.data;
            // console.log(alerts, extent);
            const alertsByDate = data.filter(d =>
              moment(d.date).isAfter(moment().subtract(4, 'weeks'))
            );
            console.log(extent);
            // const groupedAlerts = groupBy(alertsByDate, 'adm1');
            // const mappedData = Object.keys(groupedAlerts).map(k => {
            //   const area = areas.find(a => a.id === k);
            //   return {
            //     id: k,
            //     counts: sumBy(groupedAlerts[k], 'counts'),
            //     area: area && area.area_ha,
            //     areaPerc: area && area.area_perc
            //   };
            // });
            // console.log('mapped', mappedData);
            // const extentData = getLocationsResponse.data.data;
            // const extentMappedData = {};
            // if (extentData && extentData.length) {
            //   extentMappedData.regions = extentData.map(d => ({
            //     id: d.region,
            //     extent: d.extent || 0,
            //     percentage: d.extent ? d.extent / d.total * 100 : 0
            //   }));
            // }

            // const lossData = getLocationsLossResponse.data.data;
            // const lossMappedData = {};
            // if (lossData && lossData.length) {
            //   const lossByRegion = groupBy(lossData, 'region');
            //   lossMappedData.regions = Object.keys(lossByRegion).map(d => {
            //     const regionLoss = lossByRegion[d];
            //     return {
            //       id: parseInt(d, 10),
            //       loss: regionLoss
            //     };
            //   });
            // }
            // dispatch(
            //   setGladBiodiversityData({
            //     loss: lossMappedData,
            //     extent: extentMappedData
            //   })
            // );
          })
        )
        .catch(error => {
          console.info(error);
          dispatch(setGladBiodiversityLoading({ loading: false, error: true }));
        });
    }
  }
);

export default {
  setGladBiodiversityData,
  setGladBiodiversityPage,
  setGladBiodiversitySettings,
  setGladBiodiversityLoading,
  getGladBiodiversity
};
