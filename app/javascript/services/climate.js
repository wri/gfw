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
  aboveground_biomass: {
    globalAndCountry: `SELECT iso, SUM(biomass) as total_biomass__t, SUM(biomassdensity) as biomass_density__ktha FROM biomass_whrc_gadm36 WHERE threshold = ${' '}
{threshold} GROUP BY iso`,
    adm1: `SELECT iso, admin_1, SUM(biomass) as total_biomass__t, SUM(biomassdensity) as biomass_density__ktha FROM biomass_whrc_gadm36 WHERE iso =${' '}
'{adm0}' AND threshold = {threshold} GROUP BY iso, admin_1`,
    adm2: `SELECT iso, admin_1, admin_2, SUM(biomass) as total_biomass__t, SUM(biomassdensity) as biomass_density__ktha FROM biomass_whrc_gadm36${' '}
WHERE iso = '{adm0}' AND admin_1 = {adm1} AND threshold = {threshold} GROUP BY iso, admin_1, admin_2`
  },
  soil_organic_carbon: {
    globalAndCountry:
      'SELECT iso, SUM(total_soil_carbon) as total_biomass__t, SUM(soil_carbon_density) as biomass_density__ktha FROM soil_carbon_gadm36 GROUP BY iso',
    adm1: `SELECT iso, admin_1, SUM(total_soil_carbon) as total_biomass__t, SUM(soil_carbon_density) as biomass_density__ktha FROM soil_carbon_gadm36${' '}
WHERE iso = '{adm0}' GROUP BY iso, admin_1`,
    adm2: `SELECT iso, admin_1, admin_2, SUM(total_soil_carbon) as total_biomass__t, SUM(soil_carbon_density) as biomass_density__ktha FROM${' '}
soil_carbon_gadm36 WHERE iso = '{adm0}' AND admin_1 = {adm1} GROUP BY iso, admin_1, admin_2`
  },
  cummulative: `SELECT sum(alerts) AS alerts, sum(cumulative_emissions) AS cumulative_emissions_MtC02, sum(cumulative_deforestation) AS${' '}
cumulative_deforestation, sum(loss_ha) AS loss__ha, sum(percent_to_emissions_target) AS percent_to_emissions_target,${' '}
sum(percent_to_deforestation_target) AS percent_to_deforestation_target, year as year, country_iso, week FROM${' '}
a98197d2-cd8e-4b17-ab5c-fabf54b25ea0 WHERE country_iso = '{iso}' AND year IN ('{year}') AND week <= 53 GROUP BY week,${' '}
country_iso ORDER BY week ASC`,
  emissions: `SELECT indicator_id, values.cartodb_id AS cartodb_id, values.iso, values.sub_nat_id, values.boundary_code, values.thresh, ${' '}
values.the_geom, values.the_geom_webmercator, values.country AS country_name, values.country AS admin0_name, values.year, ${' '}
CAST(values.value AS double precision) AS value, values.value AS text_value, subnat.name_1 AS sub_nat_name, boundaries.boundary_name${' '}
FROM gfw_climate_country_pages_indicator_values_2017_data_20180913 AS values${' '}
LEFT JOIN gadm28_adm1 AS subnat ON values.sub_nat_id = subnat.id_1${' '}
AND values.iso = subnat.iso LEFT JOIN gfw_climate_country_pages_boundary_info_2017_data${' '}
AS boundaries ON values.boundary_code = boundaries.boundary_code${' '}
WHERE indicator_id = {indicator} AND value IS NOT NULL AND thresh = ${' '}
{threshold} AND values.iso = UPPER('{adm0}') AND values.sub_nat_id IS NULL AND values.boundary_code = 'admin' ORDER BY year`
};

export const getEmissions = ({ threshold, adm0, download }) =>
  INDICATORS.map(indicator => {
    const url = `${process.env.CARTO_API}/sql?q=${SQL_QUERIES.emissions}`;
    const newUrl = url
      .replace('{indicator}', indicator)
      .replace('{threshold}', threshold || 0)
      .replace('{adm0}', adm0);

    if (download) {
      return {
        name: 'emissions_per_year',
        url: newUrl.concat('&format=csv')
      };
    }
    return request.get(encodeURI(newUrl));
  });

export const getCumulative = ({ download, ...params }) =>
  range(2015, 2019).map(year => {
    const url = `https://production-api.globalforestwatch.org/v1/query/?sql=${
      SQL_QUERIES.cummulative
    }`;
    const newUrl = url.replace('{iso}', params.adm0).replace('{year}', year);

    if (download) {
      return {
        name: 'cummulative_emissions_and_deforestation',
        url: encodeURI(newUrl.replace('query', 'download'))
      };
    }

    return request.get(encodeURI(newUrl)).then(response => ({
      ...response,
      data: {
        data: response.data.data.map(o => {
          delete Object.assign(o, { loss: o.loss__ha }).loss__ha;
          delete Object.assign(o, {
            cumulative_emissions: o.cumulative_emissions_MtC02
          }).cumulative_emissions_MtC02;
          return o;
        })
      }
    }));
  });

export const getBiomassRanking = ({
  adm0,
  adm1,
  adm2,
  threshold,
  download
}) => {
  let query;

  if (!adm1) {
    query = SQL_QUERIES.aboveground_biomass.globalAndCountry.replace(
      '{threshold}',
      threshold
    );
  } else if (adm1 && !adm2) {
    query = SQL_QUERIES.aboveground_biomass.adm1
      .replace('{adm0}', adm0)
      .replace('{threshold}', threshold);
  } else if (adm1 && adm2) {
    query = SQL_QUERIES.aboveground_biomass.adm2
      .replace('{adm0}', adm0)
      .replace('{adm1}', adm1)
      .replace('{threshold}', threshold);
  }
  const url = `${process.env.CARTO_API}/sql?q=${query}`;

  if (download) {
    return {
      name: 'biomass_loss_by_region',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { total_biomass__t: o.totalbiomass })
          .totalbiomass;
        delete Object.assign(o, { biomass_density__ktha: o.biomassdensity })
          .biomassdensity;
        return o;
      })
    }
  }));
};

export const getSoilOrganicCarbon = ({ adm0, adm1, adm2, download }) => {
  let query;

  if (!adm1) {
    query = SQL_QUERIES.soil_organic_carbon.globalAndCountry;
  } else if (adm1 && !adm2) {
    query = SQL_QUERIES.soil_organic_carbon.adm1.replace('{adm0}', adm0);
  } else if (adm1 && adm2) {
    query = SQL_QUERIES.soil_organic_carbon.adm2
      .replace('{adm0}', adm0)
      .replace('{adm1}', adm1);
  }
  const url = `${process.env.CARTO_API}/sql?q=${query}`;

  if (download) {
    return {
      name: 'soil_organic_carbon',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { total_biomass__t: o.totalbiomass })
          .totalbiomass;
        delete Object.assign(o, { biomass_density__ktha: o.biomassdensity })
          .biomassdensity;
        return o;
      })
    }
  }));
};
