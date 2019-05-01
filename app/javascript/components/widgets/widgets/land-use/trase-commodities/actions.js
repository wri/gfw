import groupBy from 'lodash/groupBy';

import { fetchTraseContexts, fetchTraseLocationData } from 'services/trase';

export default ({ params }) =>
  fetchTraseContexts().then(response => {
    const commodityGrouped = groupBy(response.data.data, 'commodityName');
    const commodities = Object.keys(commodityGrouped).map(c => ({
      label: c,
      value: c
    }));
    const context = response.data.data.filter(
      d => d.countryName === 'BRAZIL' && d.commodityName === params.commodity
    );
    const countryContext = context && context[0];

    return fetchTraseLocationData(
      countryContext.id,
      countryContext.worldMap.countryColumnId
    ).then(data => ({
      data: {
        context: countryContext,
        topNodes: data.data.data
      },
      options: {
        yearsRange: countryContext.years,
        commodities
      },
      settings: {
        startYear: countryContext.years[0],
        endYear: countryContext.years[countryContext.years.length - 1]
      }
    }));
  });
