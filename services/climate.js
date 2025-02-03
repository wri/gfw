import request from 'utils/request';
import range from 'lodash/range';

import { CARTO_API } from 'utils/apis';

const INDICATORS = [
  3110, // (Carbon) Young Secondary Forest
  3111, // (Carbon) Mid-Age Secondary Forests
  3112, // (Carbon) Pasture
  3113, // (Carbon) Crops
  3114, // C02 Young Secondary Forest
  3115, // C02 Mid-Age Secondary Forests
  3116, // C02 Pasture
  3117, // C02 Crops
];

const SQL_QUERIES = {
  cummulative:
    "SELECT sum(alerts) AS alert__count, sum(cumulative_emissions) AS cumulative_emissions__t_C02, sum(cumulative_deforestation) AS cumulative_deforestation__ha, sum(loss_ha) AS treecover_loss__ha, sum(percent_to_emissions_target) AS percent_to_emissions_target, sum(percent_to_deforestation_target) AS percent_to_deforestation_target, year as year, country_iso, week as iso_week FROM a98197d2-cd8e-4b17-ab5c-fabf54b25ea0 WHERE country_iso = '{iso}' AND year IN ({year}) AND week <= 53 GROUP BY week, country_iso ORDER BY week ASC",
  emissions:
    "SELECT indicator_id, values.cartodb_id AS cartodb_id, values.iso, values.sub_nat_id, values.boundary_code, values.thresh, values.the_geom, values.the_geom_webmercator, values.country AS country_name, values.country AS admin0_name, values.year, CAST(values.value AS double precision) AS value, values.value AS text_value, subnat.name_1 AS sub_nat_name, boundaries.boundary_name FROM gfw_climate_country_pages_indicator_values_2017_data_20180913 AS values LEFT JOIN gadm28_adm1 AS subnat ON values.sub_nat_id = subnat.id_1 AND values.iso = subnat.iso LEFT JOIN gfw_climate_country_pages_boundary_info_2017_data AS boundaries ON values.boundary_code = boundaries.boundary_code WHERE indicator_id = {indicator} AND value IS NOT NULL AND thresh = {threshold} AND values.iso = UPPER('{adm0}') AND values.sub_nat_id IS NULL AND values.boundary_code = 'admin' ORDER BY year",
};

export const getEmissions = ({ threshold, adm0, download }) =>
  INDICATORS.map((indicator) => {
    const url = `${CARTO_API}/sql?q=${SQL_QUERIES.emissions}`;
    const newUrl = url
      .replace('{indicator}', indicator)
      .replace('{threshold}', threshold || 0)
      .replace('{adm0}', adm0);

    if (download) {
      return {
        name: 'emissions_per_year',
        url: newUrl.concat('&format=csv'),
      };
    }
    return request.get(encodeURI(newUrl));
  });

export const getCumulative = ({ download, ...params }) =>
  range(2015, 2019).map((year) => {
    const url = `https://api.resourcewatch.org/v1/query/?sql=${SQL_QUERIES.cummulative}`;
    const newUrl = url.replace('{iso}', params.adm0).replace('{year}', year);

    if (download) {
      return {
        name: 'cummulative_emissions_and_deforestation',
        url: encodeURI(newUrl.replace('query', 'download')),
      };
    }

    return request.get(encodeURI(newUrl)).then((response) => ({
      ...response,
      data: {
        data: response.data.data.map((o) => {
          delete Object.assign(o, { loss: o.treecover_loss__ha }).loss__ha;
          delete Object.assign(o, {
            cumulative_deforestation: o.cumulative_deforestation__ha,
          }).cumulative_deforestation__ha;
          delete Object.assign(o, { alerts: o.alert__count }).alert__count;
          delete Object.assign(o, {
            cumulative_emissions: o.cumulative_emissions__t_C02,
          }).cumulative_emissions__t_C02;
          return o;
        }),
      },
    }));
  });
