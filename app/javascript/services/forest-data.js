import request from 'utils/request';

import globalLandCoverCategories from 'data/global-land-cover-categories.json';

const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const NEW_SQL_QUERIES = {
  faoExtent:
    'SELECT country AS iso, name, plantfor * 1000 AS planted_forest__ha, primfor * 1000 AS primary_forest__ha, natregfor * 1000 AS regenerated_forest__ha, forest * 1000 AS fao_treecover__ha, totarea as area_ha FROM table_1_forest_area_and_characteristics WHERE {location} AND year = 2015',
  faoReforest:
    'SELECT country AS iso, name, year, reforest * 1000 AS reforestation__rate, forest*1000 AS fao_treecover_reforest__ha FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {period} AND reforest > 0 ORDER BY reforestation__rate DESC',
  faoDeforest:
    'SELECT fao.country as iso, fao.name, fao.deforest * 1000 AS fao_treecover_deforest__ha, fao.humdef, fao.year FROM table_1_forest_area_and_characteristics as fao {location}',
  faoDeforestRank:
    'WITH mytable AS (SELECT fao.country as iso, fao.name, fao.deforest * 1000 AS deforest, fao.humdef FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {year} AND deforest is not null), rank AS (SELECT deforest, iso, name from mytable ORDER BY mytable.deforest DESC) SELECT row_number() over () as rank, iso, name, deforest as fao_treecover_deforest__ha from rank',
  faoEcoLive:
    'SELECT fao.country as iso, fao.forempl as total_forest_employees, fao.femempl as female_forest_employees, fao.usdrev as revenue__usd, fao.usdexp as expenditure__usd, fao.gdpusd2012 as gdp_2012__usd, fao.totpop1000, fao.year FROM table_7_economics_livelihood as fao WHERE fao.year = 2000 or fao.year = 2005 or fao.year = 2010 or fao.year = 9999',
  globalLandCover: 'SELECT * FROM global_land_cover_adm2 WHERE {location}',
  globalLandCoverURL: `SELECT
  cartodb_id,
  the_geom,
  the_geom_webmercator,
  adm1,
  adm2,
  iso,
  year,
  ${globalLandCoverCategories
    .map(
      category =>
        `(${category.classes
          .map(c => `coalesce(${c}, 0)`)
          .join(' + \n')}) AS ${category.label
          .replace(/ /g, '_')
          .toLowerCase()}`
    )
    .join(',\n')}
  FROM global_land_cover_adm2 WHERE {location}`,
  getNLCDLandCover:
    'SELECT from_class_nlcd AS initial_nlcd_category, to_class_nlcd AS final_nlcd_category, from_class_ipcc AS initial_ipcc_category, to_class_ipcc AS final_ipcc_category, {area} FROM nlcd_land_cover WHERE from_year = {startYear} AND to_year = {endYear} {adm} {groupby}'
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const getFAOExtent = ({ adm0, download }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoExtent}`.replace(
    '{location}',
    adm0 ? `country = '${adm0}'` : '1 = 1'
  );

  if (download) {
    return {
      name: 'fao_treecover_extent__ha',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        // delete old key, replace it with new
        // delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey]
        delete Object.assign(o, { planted_forest: o.planted_forest__ha })
          .planted_forest__ha;
        delete Object.assign(o, { forest_primary: o.primary_forest__ha })
          .primary_forest__ha;
        delete Object.assign(o, {
          forest_regenerated: o.regenerated_forest__ha
        }).regenerated_forest__ha;
        delete Object.assign(o, { extent: o.fao_treecover__ha })
          .fao_treecover__ha;
        return o;
      })
    }
  }));
};

export const getFAOReforest = ({ period, download }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoReforest}`.replace(
    '{period}',
    period
  );

  if (download) {
    return {
      name: 'fao_treecover_reforestation__ha',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { rate: o.reforestation__rate })
          .reforestation__rate;
        delete Object.assign(o, { extent: o.fao_treecover_reforest__ha })
          .fao_treecover_reforest__ha;
        return o;
      })
    }
  }));
};

export const getFAODeforest = ({ adm0, download }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforest}`.replace(
    '{location}',
    adm0 ? `WHERE fao.country = '${adm0}'` : ''
  );

  if (download) {
    return {
      name: 'fao_treecover_deforestation__ha',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { country: o.iso }).iso;
        delete Object.assign(o, { deforest: o.fao_treecover_deforest__ha })
          .fao_treecover_deforest__ha;
        return o;
      })
    }
  }));
};

export const getFAODeforestRank = ({ period, download }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforestRank}`.replace(
    '{year}',
    period
  );

  if (download) {
    return {
      name: 'fao_treecover_deforestation_rank',
      url: url.concat('&format=csv')
    };
  }
  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { deforest: o.fao_treecover_deforest__ha })
          .fao_treecover_deforest__ha;
        return o;
      })
    }
  }));
};

export const getFAOEcoLive = params => {
  const { download } = params || {};
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoEcoLive}`;

  if (download) {
    return {
      name: 'fao_treecover_economic_live',
      url: url.concat('&format=csv')
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { country: o.iso }).iso;
        delete Object.assign(o, { usdrev: o.revenue__usd }).revenue__usd;
        delete Object.assign(o, { usdexp: o.expenditure__usd })
          .expenditure__usd;
        delete Object.assign(o, { gdpusd2012: o.gdp_2012__usd }).gdp_2012__usd;
        delete Object.assign(o, { forempl: o.total_forest_employees })
          .total_forest_employees;
        delete Object.assign(o, { femempl: o.female_forest_employees })
          .female_forest_employees;
        return o;
      })
    }
  }));
};

export const getGlobalLandCover = ({ adm0, adm1, adm2, download }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );

  if (download) {
    return {
      name: 'global_land_cover',
      url: url.concat('&format=csv')
    };
  }

  // TODO: refactor global land cover widget to use method below
  return request.get(url);
};

export const getGlobalLandCoverURL = ({ adm0, adm1, adm2 }) => {
  const url = `${CARTO_REQUEST_URL}${
    NEW_SQL_QUERIES.globalLandCoverURL
  }`.replace('{location}', getLocationQuery(adm0, adm1, adm2));

  return {
    name: 'global_land_cover',
    url: encodeURI(url.concat('&format=csv')).replace(/\+/g, '%2B')
  };
};

export const getUSLandCover = params => {
  const { adm0, adm1, adm2, startYear, endYear, download } = params;
  let admQuery = '';
  if (adm1 && !adm2) {
    // adm1
    admQuery = `AND adm1 = ${adm1}`;
  } else if (adm1 && adm2) {
    // adm 2
    admQuery = `AND adm1 = ${adm1} AND adm2 = ${adm2}`;
  }
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.getNLCDLandCover}`
    .replace('{area}', adm2 ? 'class_area as area' : 'SUM(class_area) as area')
    .replace('{startYear}', startYear)
    .replace('{endYear}', endYear)
    .replace('{adm}', admQuery)
    .replace(
      '{groupby}',
      adm2
        ? ''
        : 'GROUP BY to_class_ipcc, from_class_nlcd, to_class_nlcd, from_class_ipcc'
    );
  if (download) {
    return {
      name: 'us_land_cover',
      url: url.concat(
        `&format=csv&filename=land_cover_in_ha_in_${adm0}${
          adm1 ? `_${adm1}` : ''
        }${adm2 ? `_${adm2}` : ''}_from_${startYear}_to_${endYear}`
      )
    };
  }

  return request.get(url).then(response => ({
    ...response,
    data: {
      rows: response.data.rows.map(o => {
        delete Object.assign(o, { from_class_ipcc: o.initial_ipcc_category })
          .initial_ipcc_category;
        delete Object.assign(o, { to_class_ipcc: o.final_ipcc_category })
          .final_ipcc_category;
        delete Object.assign(o, { from_class_nlcd: o.initial_nlcd_category })
          .initial_nlcd_category;
        delete Object.assign(o, { to_class_nlcd: o.final_nlcd_category })
          .final_nlcd_category;
        return o;
      })
    }
  }));
};
