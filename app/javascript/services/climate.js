import request from 'utils/request';
import range from 'lodash/range';

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
    'SELECT iso, SUM(biomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM biomass_whrc_gadm36 WHERE threshold = {threshold} GROUP BY iso',
  adm1:
    "SELECT iso, admin_1, SUM(biomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM biomass_whrc_gadm36 WHERE iso = '{adm0}' AND threshold = {threshold} GROUP BY iso, admin_1",
  adm2:
    "SELECT iso, admin_1, admin_2, SUM(biomass) as totalbiomass, SUM(biomassdensity) as biomassdensity FROM biomass_whrc_gadm36 WHERE iso = '{adm0}' AND admin_1 = {adm1} AND threshold = {threshold} GROUP BY iso, admin_1, admin_2"
};

export const getEmissions = ({ threshold, adm0 }) =>
  INDICATORS.map(indicator => {
    const url = `${process.env.CARTO_API}/sql?q=`;
    const query = `SELECT indicator_id,
values.cartodb_id AS cartodb_id,
values.iso,
values.sub_nat_id,
values.boundary_code,
values.thresh,
values.the_geom,
values.the_geom_webmercator,
values.country AS country_name,
values.country AS admin0_name,
values.year,
CAST(values.value AS double precision) AS value,
values.value AS text_value,
subnat.name_1 AS sub_nat_name,
boundaries.boundary_name${' '}
FROM gfw_climate_country_pages_indicator_values_2017_data_20180913 AS values${' '}
LEFT JOIN gadm28_adm1 AS subnat ON values.sub_nat_id = subnat.id_1${' '}
AND values.iso = subnat.iso LEFT JOIN gfw_climate_country_pages_boundary_info_2017_data${' '}
AS boundaries ON values.boundary_code = boundaries.boundary_code${' '}
WHERE indicator_id = ${indicator} AND value IS NOT NULL AND thresh =
${threshold || 0} AND values.iso = UPPER('${
  adm0
}') AND values.sub_nat_id IS NULL AND values.boundary_code = 'admin' ORDER BY year`;

    return request.get(encodeURI(`${url}${query}`));
  });

export const getCumulative = params =>
  range(2015, 2019).map(year => {
    const url = `${process.env.GFW_API}/v1/query/?sql=`;
    const query = `SELECT sum(alerts) AS alerts,
sum(cumulative_emissions) AS cumulative_emissions,
sum(cumulative_deforestation) AS cumulative_deforestation,
sum(loss_ha) AS loss,
sum(percent_to_emissions_target) AS percent_to_emissions_target,
sum(percent_to_deforestation_target) AS percent_to_deforestation_target,
year as year,
country_iso,
week FROM a98197d2-cd8e-4b17-ab5c-fabf54b25ea0 WHERE country_iso =
'${params.adm0}' AND year IN ('${year}') AND week
<= 53 GROUP BY week, country_iso ORDER BY week ASC`;
    return request.get(encodeURI(`${url}${query}`));
  });

export const getBiomassRanking = ({
  adm0,
  adm1,
  adm2,
  variable,
  threshold
}) => {
  let query;

  if (!adm1) {
    query = SQL_QUERIES.globalAndCountry
      .replace('{variable}', variable)
      .replace('{threshold}', threshold);
  } else if (adm1 && !adm2) {
    query = SQL_QUERIES.adm1
      .replace('{variable}', variable)
      .replace('{adm0}', adm0)
      .replace('{threshold}', threshold);
  } else if (adm1 && adm2) {
    query = SQL_QUERIES.adm2
      .replace('{variable}', variable)
      .replace('{adm0}', adm0)
      .replace('{adm1}', adm1)
      .replace('{threshold}', threshold);
  }
  const url = `${process.env.CARTO_API}/sql?q=${query}`;

  return request.get(url);
};
