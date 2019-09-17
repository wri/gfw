import { getMeta, getGas } from 'services/emissions';

export default {
  widget: 'emissions',
  title: 'Historical emissions in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0'],
  metaKey: 'widget_historical_emissions',
  dataType: 'loss',
  colors: 'emissions',
  chartType: 'composedChart',
  sortOrder: {
    climate: 1
  },
  sentences: {
    positive:
      'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, emitting an average of {value} per year from {startYear} to {endYear}. This represents {percentage} of {location_alt} total greenhouse gas emissions over the same period.',
    negative:
      'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, sequestering an average of {value} per year from {startYear} to {endYear}. This represents an offset of {percentage} of {location_alt} total greenhouse gas emissions over the same period.'
  },
  getData: params =>
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
    })
};
