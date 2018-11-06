import axios from 'axios';

export default ({ params }) => {
  const { adm0, adm1 } = params;
  let sql;

  if (!adm0 && !adm1) {
    // console.log('Request for Global areas');
    sql = `SELECT iso AS location, sum(area) as area, 
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
GROUP BY iso`;
  } else if (adm0 && !adm1) {
    // console.log('Request for country areas')
    sql = `SELECT iso, adm1 AS location, sum(area) as area, "
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
WHERE iso = '${adm0}' 
GROUP BY iso, adm1`;
  } else if (adm0 && adm1) {
    // console.log('Request adm1 areas');
    sql = `SELECT iso, adm1, adm2 AS location, sum(area) as area, 
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
WHERE iso = '${adm0}' 
AND adm1 = '${adm1}'
GROUP BY iso, adm1, adm2`;
  }

  /*
    TODO: should have an else statement for catching error 
    cases such as !adm0 && adm1 ?
  */

  return axios
    .get('https://wri-01.carto.com/api/v2/sql', { params: { q: sql } })
    .then(response => {
      // eslint-disable-next-line no-console
      console.log(response);
      return response.data.rows;
    });
};
