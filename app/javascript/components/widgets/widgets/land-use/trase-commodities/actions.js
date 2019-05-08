import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

import { fetchTraseContexts, fetchTraseLocationData } from 'services/trase';

const TRASE_COUNTRY_NAMES = {
  BRA: 'BRAZIL',
  COL: 'COLOMBIA',
  BOL: 'BOLIVIA',
  IDN: 'INDONESIA',
  PER: 'PERU',
  PRY: 'PARAGUAY',
  ECU: 'ECUADOR'
};

export default ({ params }) =>
  fetchTraseContexts().then(response => {
    const { startYear, endYear, commodity } = params;

    const contextsForLocation = response.data.data.filter(
      d => d.countryName === TRASE_COUNTRY_NAMES[params.adm0]
    );

    const allCommodities = uniqBy(contextsForLocation, 'commodityName').map(
      c => c.commodityName
    );
    const commoditiesForLocation = sortBy(
      allCommodities.map(c => ({
        label: c,
        value: c
      })),
      'label'
    );

    const activeCommodity =
      commodity && allCommodities.find(c => c === commodity);
    const selectedCommodity = activeCommodity || allCommodities[0];

    const selectedContext = contextsForLocation.find(
      c => c.commodityName === selectedCommodity
    );

    const minYear = selectedContext.years[0];
    const maxYear = selectedContext.years[selectedContext.years.length - 1];
    const yearsRange = [minYear, maxYear];

    return fetchTraseLocationData(
      selectedContext.id,
      selectedContext.worldMap.countryColumnId,
      startYear,
      endYear
    ).then(data => ({
      data: {
        context: selectedContext,
        topNodes: data.data.data
      },
      options: {
        yearsRange,
        commodities: commoditiesForLocation
      },
      settings: {
        startYear: !startYear || startYear < minYear ? minYear : startYear,
        endYear: !endYear || endYear > maxYear ? maxYear : endYear,
        commodity: selectedCommodity
      }
    }));
  });
