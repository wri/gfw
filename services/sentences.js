import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import tropicalIsos from 'data/tropical-isos.json';

import {
  getExtentNaturalForest,
  getLossNaturalForest,
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
    'In 2020, {location} had {extent} of natural forest, extending over {percentage} of its land area.',
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

export const getSentenceData = async (params = GLOBAL_LOCATION) => {
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
    end,
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
  sentence = tropicalIsos.includes(adm0)
    ? sentence + co2Emissions
    : sentence + end;
  if (!location) sentence = globalInitial;
  if (adm0 in countrySpecific) {
    sentence = countrySpecific[adm0];
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
