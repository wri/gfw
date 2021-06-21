import { all, spread } from 'axios';
import { format } from 'd3-format';

import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import max from 'lodash/max';
import reverse from 'lodash/reverse';
import isEmpty from 'lodash/isEmpty';

import tropicalIsos from 'data/tropical-isos.json';

import { getExtent, getLoss } from 'services/analysis-cached';

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
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
  withLoss:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
  globalInitial:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
  withPlantationLoss:
    'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
  countrySpecific: {
    IDN:
      'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
  },
  co2Emissions: ', equivalent to {emissions} of CO\u2082 of emissions.',
  end: '.',
};

export const getSentenceData = (params = GLOBAL_LOCATION) =>
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
          totalArea: (extent[0] && extent[0].total_area) || 0,
          extent: (extent[0] && extent[0].extent) || 0,
          plantationsExtent:
            plantationsExtent && plantationsExtent.length
              ? plantationsExtent[0].extent
              : 0,
          primaryExtent:
            primaryExtent && primaryExtent.length ? primaryExtent[0].extent : 0,
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

  const extentFormatted =
    extent < 1 ? format('.3r')(extent) : format('.3s')(extent);
  const naturalForest =
    extent - plantationsExtent < 1
      ? format('.3r')(extent - plantationsExtent)
      : format('.3s')(extent - plantationsExtent);
  const primaryForest =
    primaryExtent < 1
      ? format('.3r')(primaryExtent)
      : format('.3s')(primaryExtent);
  const percentageCover =
    extent && totalArea ? format('.2r')((extent / totalArea) * 100) : 0;
  const percentageNatForest = format('.2r')(
    ((extent - plantationsExtent) / totalArea) * 100
  );
  const percentagePrimaryForest = format('.2r')(
    (primaryExtent / totalArea) * 100
  );
  const naturalLoss = format('.3s')((area || 0) - (areaPlantations || 0));
  const emissionsNaturalForest = format('.3s')(
    (emissions || 0) - (emissionsPlantations || 0)
  );
  const emissionsFormatted = format('.3s')(emissions);
  const emissionsPrimaryFormatted = format('.3s')(emissionsPrimary || 0);
  const primaryLossFormatted = format('.3s')(areaPrimary || 0);
  const loss = format('.3s')(area || 0);
  const location = locationNames && locationNames.label;
  const { adm0 } = locationObj || {};

  const params = {
    extent: `${extentFormatted}ha`,
    naturalForest: `${naturalForest}ha`,
    primaryForest: `${primaryForest}ha`,
    location: location || 'the world',
    percentage: `${percentageCover}%`,
    percentageNatForest: `${percentageNatForest}%`,
    percentagePrimaryForest: `${percentagePrimaryForest}%`,
    loss: `${loss}ha`,
    emissions: `${emissionsNaturalForest}t`,
    emissionsTreeCover: `${emissionsFormatted}t`,
    emissionsPrimary: `${emissionsPrimaryFormatted}t`,
    year,
    treeCoverLoss: `${loss}ha`,
    primaryLoss: `${primaryLossFormatted}ha`,
    naturalLoss: `${naturalLoss}ha`,
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
