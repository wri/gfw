import axios from 'axios';

export default ({ params }) => {
  const { adm0, adm1 } = params;
  let sql;

  if (!adm0 && !adm1) {
    sql = `SELECT iso AS location, sum(area) as area, 
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
GROUP BY iso`;
  } else if (adm0 && !adm1) {
    sql = `SELECT iso, adm1 AS location, sum(area) as area, 
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
WHERE iso = '${adm0}' 
GROUP BY iso, adm1`;
  } else if (adm0 && adm1) {
    sql = `SELECT iso, adm1, adm2 AS location, sum(area) as area, 
sum(significance_total) AS sig, sum(intactness_total) AS int 
FROM global_biodiversity_table 
WHERE iso = '${adm0}' 
AND adm1 = '${adm1}'
GROUP BY iso, adm1, adm2`;
  }

  return axios
    .get(`${process.env.CARTO_API}/sql`, { params: { q: sql } })
    .then(response => response.data.rows);
};
