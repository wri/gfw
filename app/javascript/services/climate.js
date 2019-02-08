import request from 'utils/request';

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
