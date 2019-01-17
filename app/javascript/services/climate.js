import request from 'utils/request';

const REQUEST_URL =
  'http://climate.globalforestwatch.org/api/indicators/{indicator}?thresh={thresh}&iso={iso}&id_1={id}&area={area}';

const INDICATORS = [
  3110, // (Carbon) Young Secondary Forest
  3111, // (Carbon) Mid-Age Secondary Forests
  3112, // (Carbon) Pasture
  3113, // (Carbon) Crops
  3114, // C02 Young Secondary Forest
  3115, // C02 Mid-Age Secondary Forests
  3116, // C02 Pasture
  3117 // C02 Crops
];

const SQL_QUERIES = {
  globalAndCountry:
    'SELECT gid_0 as iso, SUM(totalbiomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM whrc_biomass GROUP BY iso',
  adm1:
    "SELECT gid_0 as iso, id_1, SUM(totalbiomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM whrc_biomass WHERE gid_0 = '{adm0}' GROUP BY iso, id_1",
  adm2:
    "SELECT gid_0 as iso, id_1, id_2, SUM(totalbiomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM whrc_biomass WHERE gid_0 = '{adm0}' AND id_1 = {adm1} GROUP BY iso, id_1, id_2"
};

export const getEmissions = ({ threshold, adm0, adm1, adm2 }) =>
  INDICATORS.map(indicator => {
    const url = REQUEST_URL.replace('{indicator}', indicator)
      .replace('{thresh}', threshold || '0')
      .replace('{iso}', adm0 ? String(adm0) : '')
      .replace('{id}', adm1 ? String(adm1) : '')
      .replace('{area}', adm2 ? String(adm1) : '');
    return request.get(url);
  });

export const getBiomassRanking = ({ adm0, adm1, adm2, variable }) => {
  let query;

  if (!adm1) {
    query = SQL_QUERIES.globalAndCountry.replace('{variable}', variable);
  } else if (adm1 && !adm2) {
    query = SQL_QUERIES.adm1
      .replace('{variable}', variable)
      .replace('{adm0}', adm0);
  } else if (adm1 && adm2) {
    query = SQL_QUERIES.adm2
      .replace('{variable}', variable)
      .replace('{adm0}', adm0)
      .replace('{adm1}', adm1);
  }
  const url = `${process.env.CARTO_API}/sql?q=${query}`;

  return request.get(url);
};

