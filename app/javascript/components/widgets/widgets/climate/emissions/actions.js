import { getMeta, getGas } from 'services/emissions';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getMeta()
    .then(getMetaResponse => {
      const dataSource = getMetaResponse.data.data_source.filter(
        item => item.source === 'historical_emissions_CAIT'
      );
      const gas = getMetaResponse.data.gas.filter(
        item => item.name === 'All GHG'
      );
      if (dataSource.length && gas.length) {
        getGas({ ...params, source: dataSource[0].id, gas: gas[0].id })
          .then(getGasResponse => {
            dispatch(setWidgetData({ data: getGasResponse.data, widget }));
          })
          .catch(error => {
            dispatch(setWidgetData({ data: {}, widget }));
            console.error(error);
          });
      } else {
        dispatch(setWidgetData({ data: {}, widget }));
      }
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
