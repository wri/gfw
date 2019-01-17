import request from 'utils/request';
import range from 'lodash/range';

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

export const getEmissions = ({ threshold, adm0, adm1, adm2 }) =>
  INDICATORS.map(indicator => {
    const url = REQUEST_URL.replace('{indicator}', indicator)
      .replace('{thresh}', threshold || '0')
      .replace('{iso}', adm0 ? String(adm0) : '')
      .replace('{id}', adm1 ? String(adm1) : '')
      .replace('{area}', adm2 ? String(adm1) : '');
    return request.get(url);
  });

export const getCumulative = params =>
  range(2015, 2019).map(year => {
    // const url = `${process.env.GFW_API}`;
    const url = 'https://production-api.globalforestwatch.org/v1/query/?sql=';
    const query = `SELECT sum(alerts) AS alerts,
sum(cumulative_emissions) AS cumulative_emissions,
sum(cumulative_deforestation) AS cumulative_deforestation, 
year as year, 
country_iso, 
week 
FROM a98197d2-cd8e-4b17-ab5c-fabf54b25ea0 
WHERE country_iso ='${params.adm0}' 
AND year IN ('${year}') AND week <= 53 
GROUP BY week, country_iso 
ORDER BY week ASC`;
    return request.get(`${url}/${query}`);
  });

/*

sum(above_ground_carbon_loss) AS above_ground_carbon_loss, 
sum(percent_to_emissions_target) AS percent_to_emissions_target, 
sum(percent_to_deforestation_target) AS percent_to_deforestation_target, 
sum(loss_ha) AS loss, 
*/
