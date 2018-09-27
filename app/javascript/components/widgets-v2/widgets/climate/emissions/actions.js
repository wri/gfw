import { getMeta, getGas } from 'services/emissions';

export default ({ params }) =>
  getMeta().then(getMetaResponse => {
    const dataSource = getMetaResponse.data.data_source.filter(
      item => item.source === 'historical_emissions_CAIT'
    );
    const gas = getMetaResponse.data.gas.filter(
      item => item.name === 'All GHG'
    );
    if (dataSource.length && gas.length) {
      return getGas({
        ...params,
        source: dataSource[0].id,
        gas: gas[0].id
      }).then(getGasResponse => getGasResponse.data);
    }
    return {};
  });
