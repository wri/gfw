import { all, spread } from 'axios';
import { formatNumber } from 'utils/format';

import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import max from 'lodash/max';
import reverse from 'lodash/reverse';
import isEmpty from 'lodash/isEmpty';

import {
  getExtentNaturalForest,
  getLossNaturalForest,
  getExtent,
  getLoss,
} from 'services/analysis-cached';

const ADMINS = {
  adm0: null,
  adm1: null,
  adm2: null,
};

const GLOBAL_LOCATION = {
  ...ADMINS,
  type: 'global',
  threshold: 30,
  extentYear: 2010,
};

export const adminSentences = {
  default:
    'In 2020, {location} had {extent} of natural forest, extending over {percentage} of its land area',
  withLoss:
    'In 2020, {location} had {extent} of natural forest, extending over {percentage} of its land area. In {year}, it lost {loss} of natural forest',
  globalInitial:
    'In 2020, {location} had {extent} of natural forest, extending over {percentage} of its land area. In {year}, it lost {loss} of natural forest',
  withPlantationLoss:
    'In 2020, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
  countrySpecific: {
    IDN: 'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ emissions.',
  },
  co2Emissions: ', equivalent to {emissionsTreeCover} of CO\u2082 emissions.',
  end: '.',
};

const getSentenceDataForIdn = (params = GLOBAL_LOCATION) =>
  all([
    getExtent(params),
    getExtent({ ...params, forestType: 'plantations' }),
    getExtent({
      ...params,
      forestType: 'primary_forest',
      extentYear: 2000,
    }),
    getLoss(params),
    getLoss({ ...params, forestType: 'plantations' }),
    getLoss({ ...params, forestType: 'primary_forest' }),
  ]).then(
    spread(
      (
        totalExtent,
        totalPlantationsExtent,
        totalPrimaryExtent,
        totalLoss,
        totalPlantationsLoss,
        totalPrimaryLoss
      ) => {
        const extent = totalExtent.data.data;
        const loss = totalLoss.data.data;
        const plantationsLoss = totalPlantationsLoss.data.data;
        const plantationsExtent = totalPlantationsExtent.data.data;
        const primaryExtent = totalPrimaryExtent.data.data;

        // group over years
        const groupedLoss = plantationsLoss && groupBy(loss, 'year');
        const groupedPlantationsLoss =
          plantationsLoss && groupBy(plantationsLoss, 'year');

        const primaryLoss = totalPrimaryLoss.data.data;
        const latestYear = max(Object.keys(groupedLoss));

        const latestPlantationLoss = groupedPlantationsLoss[latestYear] || null;
        const latestLoss = groupedLoss[latestYear] || null;

        // sum over different bound1 within year
        const summedPlantationsLoss =
          latestPlantationLoss &&
          latestPlantationLoss.length &&
          latestPlantationLoss[0].area
            ? sumBy(latestPlantationLoss, 'area')
            : 0;
        const summedPlantationsEmissions =
          latestPlantationLoss &&
          latestPlantationLoss.length &&
          latestPlantationLoss[0].emissions
            ? sumBy(latestPlantationLoss, 'emissions')
            : 0;
        const summedLoss =
          latestLoss && latestLoss.length && latestLoss[0].area
            ? sumBy(latestLoss, 'area')
            : 0;
        const summedEmissions =
          latestLoss && latestLoss.length && latestLoss[0].emissions
            ? sumBy(latestLoss, 'emissions')
            : 0;

        const data = {
          totalArea:
            extent && extent.length && extent[0].total_area
              ? sumBy(extent, 'total_area')
              : 0,
          extent:
            extent && extent.length && extent[0].extent
              ? sumBy(extent, 'extent')
              : 0,
          plantationsExtent:
            plantationsExtent &&
            plantationsExtent.length &&
            plantationsExtent[0].extent
              ? sumBy(plantationsExtent, 'extent')
              : 0,
          primaryExtent:
            primaryExtent && primaryExtent.length && primaryExtent[0].extent
              ? sumBy(primaryExtent, 'extent')
              : 0,
          totalLoss: {
            area: summedLoss || 0,
            year: latestYear || 0,
            emissions: summedEmissions || 0,
          },
          plantationsLoss: {
            area: summedPlantationsLoss || 0,
            emissions: summedPlantationsEmissions || 0,
          },
          primaryLoss:
            primaryLoss && primaryLoss.length
              ? reverse(sortBy(primaryLoss, 'year'))[0]
              : {},
        };

        return data;
      }
    )
  );

const getNaturalForestSentenceData = async (params = GLOBAL_LOCATION) => {
  try {
    const extentNaturalForestResponse = await getExtentNaturalForest(params);
    const lossNaturalForestResponse = await getLossNaturalForest({
      ...params,
      umd_tree_cover_loss__year: 2023,
      isNaturalForest: true,
    });

    let extent = 0;
    let totalArea = 0;

    extentNaturalForestResponse.data.data.forEach((item) => {
      totalArea += item.area__ha;

      if (item.sbtn_natural_forests__class === 'Natural Forest')
        extent += item.area__ha;
    });

    let lossArea = 0;
    let emissions = 0;

    lossNaturalForestResponse.data.data.forEach((item) => {
      emissions += item.gfw_gross_emissions_co2e_all_gases__mg;

      if (item.sbtn_natural_forests__class === 'Natural Forest') {
        lossArea += item.area;
      }
    });

    return {
      totalArea,
      extent,
      plantationsExtent: 0,
      primaryExtent: 0,
      totalLoss: {
        area: lossArea,
        year: 2023,
        emissions,
      },
      plantationsLoss: {
        area: 0,
        emissions: 0,
      },
      primaryLoss: {},
    };
  } catch (error) {
    return {
      totalArea: 0,
      extent: 0,
      plantationsExtent: 0,
      primaryExtent: 0,
      totalLoss: {
        area: 0,
        year: 0,
        emissions: 0,
      },
      plantationsLoss: {
        area: 0,
        emissions: 0,
      },
      primaryLoss: {},
    };
  }
};

export const getSentenceData = async (params = GLOBAL_LOCATION) => {
  if (params.adm0 === 'IDN') {
    return getSentenceDataForIdn(params);
  }

  return getNaturalForestSentenceData(params);
};

export const getContextSentence = (location, geodescriber, adminSentence) => {
  if (isEmpty(geodescriber)) return {};

  // if not an admin we can use geodescriber
  if (!['global', 'country'].includes(location.type)) {
    return {
      sentence: geodescriber.description,
      params: geodescriber.description_params,
    };
  }

  // if an admin we needs to calculate the params
  return adminSentence;
};

export const parseSentence = (
  data,
  locationNames = ADMINS,
  locationObj = GLOBAL_LOCATION
) => {
  if (
    !['global', 'country'].includes(locationObj.type) ||
    isEmpty(data) ||
    isEmpty(locationNames)
  ) {
    return {};
  }
  const {
    withLoss,
    withPlantationLoss,
    globalInitial,
    countrySpecific,
    co2Emissions,
  } = adminSentences;
  const {
    extent,
    plantationsExtent,
    primaryExtent,
    totalArea,
    totalLoss,
    plantationsLoss,
    primaryLoss,
  } = data || {};
  const { area, emissions, year } = totalLoss || {};
  const { area: areaPlantations, emissions: emissionsPlantations } =
    plantationsLoss || {};
  const { area: areaPrimary, emissions: emissionsPrimary } = primaryLoss || {};
  const extentSubtractByPlantationsExtent = extent - plantationsExtent;

  const extentFormatted = formatNumber({
    num: extent,
    unit: 'ha',
    spaceUnit: true,
  });

  const naturalForest = formatNumber({
    num: extentSubtractByPlantationsExtent,
    unit: 'ha',
    spaceUnit: true,
  });

  const primaryForest = formatNumber({
    num: primaryExtent,
    unit: 'ha',
    spaceUnit: true,
  });

  const percentageCover =
    extent && totalArea
      ? formatNumber({ num: (extent / totalArea) * 100, unit: '%' })
      : 0;

  const percentageNatForest = formatNumber({
    num: ((extent - plantationsExtent) / totalArea) * 100,
    unit: '%',
  });

  const percentagePrimaryForest = formatNumber({
    num: (primaryExtent / totalArea) * 100,
    unit: '%',
  });

  const naturalLoss = formatNumber({
    num: (area || 0) - (areaPlantations || 0),
    unit: 'ha',
    spaceUnit: true,
  });

  const emissionsNaturalForest = formatNumber({
    num: (emissions || 0) - (emissionsPlantations || 0),
    unit: 't',
    spaceUnit: true,
  });

  const emissionsFormatted = formatNumber({
    num: emissions,
    unit: 't',
    spaceUnit: true,
  });
  const emissionsPrimaryFormatted = formatNumber({
    num: emissionsPrimary || 0,
    unit: 't',
    spaceUnit: true,
  });

  const primaryLossFormatted = formatNumber({
    num: areaPrimary || 0,
    unit: 'ha',
    spaceUnit: true,
  });

  const loss = formatNumber({
    num: area || 0,
    unit: 'ha',
    spaceUnit: true,
  });
  const location = locationNames && locationNames.label;
  const { adm0 } = locationObj || {};

  const params = {
    extent: `${extentFormatted}`,
    naturalForest: `${naturalForest}`,
    primaryForest: `${primaryForest}`,
    location: location || 'the world',
    percentage: `${percentageCover}`,
    percentageNatForest: `${percentageNatForest}`,
    percentagePrimaryForest: `${percentagePrimaryForest}`,
    loss: `${loss}`,
    emissions: `${emissionsNaturalForest}`,
    emissionsTreeCover: `${emissionsFormatted}`,
    emissionsPrimary: `${emissionsPrimaryFormatted}`,
    year,
    treeCoverLoss: `${loss}`,
    primaryLoss: `${primaryLossFormatted}`,
    naturalLoss: `${naturalLoss}`,
  };

  let sentence = adminSentences.default;
  if (extent > 0 && totalLoss.area) {
    sentence = areaPlantations && location ? withPlantationLoss : withLoss;
  }

  if (!location) sentence = globalInitial;
  if (adm0 in countrySpecific) {
    sentence = countrySpecific[adm0];
  }

  if (adm0 !== 'IDN') {
    sentence += co2Emissions;
  }

  return {
    sentence,
    params,
  };
};

export const handleSSRLocationObjects = (countryData, adm0, adm1, adm2) => {
  let locationNames = {
    adm0: null,
    adm1: null,
    adm2: null,
  };

  let locationObj = {
    adm0: null,
    adm1: null,
    adm2: null,
    type: 'country',
  };

  if (adm0) {
    const country = countryData.countries.find(
      (r) => r.value === adm0.toUpperCase()
    );
    locationNames = {
      ...locationNames,
      adm0: country,
      ...country,
    };
    locationObj = {
      ...locationObj,
      adm0,
    };
  }

  if (adm1) {
    const region = countryData.regions.find((r) => r.value === adm1);
    locationNames = {
      ...locationNames,
      adm1: region,
      ...region,
    };
    locationObj = {
      ...locationObj,
      adm1,
    };
  }

  if (adm2) {
    const subRegion = countryData.subRegions.find((r) => r.value === adm2);
    locationNames = {
      ...locationNames,
      adm1: subRegion,
      ...subRegion,
    };
    locationObj = {
      ...locationObj,
      adm2,
    };
  }

  return {
    locationNames,
    locationObj,
  };
};
