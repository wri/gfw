import { cartoRequest, dataRequest } from 'utils/request';
import { PROXIES } from 'utils/proxies';

import globalLandCoverCategories from 'data/global-land-cover-categories.json';

import { CARTO_API } from 'utils/apis';

const NEW_SQL_QUERIES = {
  faoExtent:
    'SELECT iso, country, "planted forest (ha)" AS planted_forest__ha, "primary (ha)" AS primary_forest__ha, "naturally regenerating forest (ha)" AS regenerated_forest__ha, "forest (ha)" AS fao_treecover__ha, "total land area (ha)" as area_ha FROM data WHERE {location} AND year = {year}',
  faoReforest:
    'SELECT iso, country AS name, year, "reforestation (ha per year)" AS reforestation__rate, "forest expansion (ha per year)" AS fao_treecover_reforest__ha FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {yearRange} AND "reforestation (ha per year)" > 0 ORDER BY reforestation__rate DESC',
  faoReforestDownload:
    'SELECT iso, country AS name, year, "reforestation (ha per year)" AS reforestation__rate  FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {yearRange} AND "reforestation (ha per year)" > 0 ORDER BY reforestation__rate DESC',
  faoDeforest:
    'SELECT iso, country as name, "deforestation (ha per year)" as fao_treecover_deforest__ha, "reforestation (ha per year)" as fao_reforestation__ha, "forest expansion (ha per year)" as fao_expansion__ha, year FROM data where year = {yearRange}',
  faoDeforestRank:
    'SELECT iso, country, "deforestation (ha per year)" as def_per_year FROM mytable WHERE "deforestation (ha per year)" IS NOT NULL AND year = {yearRange} ORDER BY def_per_year DESC',
  faoEcoLive:
    'SELECT fao.country as iso, fao.forempl as total_forest_employees, fao.femempl as female_forest_employees, fao.usdrev as revenue__usd, fao.usdexp as expenditure__usd, fao.gdpusd2012 as gdp_2012__usd, fao.totpop1000, fao.year FROM table_7_economics_livelihood as fao WHERE fao.year = 2000 or fao.year = 2005 or fao.year = 2010 or fao.year = 9999',
  faoEmployment:
    'SELECT iso, year, "all (FTE)" AS all, "female (FTE)" AS female, "logging (FTE)" AS logging, "gathering (FTE)" AS gathering, "support (FTE)" AS support, "silviculture and other (FTE)" AS silviculture FROM data WHERE {location}',
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
      (category) =>
        `(${category.classes
          .map((c) => `coalesce(${c}, 0)`)
          .join(' + \n')}) AS ${category.label
          .replace(/ /g, '_')
          .toLowerCase()}`
    )
    .join(',\n')}
  FROM global_land_cover_adm2 WHERE {location}`,
  getNLCDLandCover:
    'SELECT from_class_nlcd AS initial_nlcd_category, to_class_nlcd AS final_nlcd_category, from_class_ipcc AS initial_ipcc_category, to_class_ipcc AS final_ipcc_category, {area} FROM nlcd_land_cover WHERE from_year = {startYear} AND to_year = {endYear} {adm} {groupby}',
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const getFAOExtent = async ({ adm0, faoYear = 2020, download }) => {
  const target = download ? 'download/csv' : 'query/json';

  const url =
    `/dataset/fao_forest_extent/v2020/${target}?sql=${NEW_SQL_QUERIES.faoExtent}`
      .replace(/{location}/g, adm0 ? `iso = '${adm0}'` : '1 = 1')
      .replace(/{year}/g, faoYear);

  if (download) {
    return {
      name: 'fao_treecover_extent__ha',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString(),
    };
  }

  const response = await dataRequest.get(url);

  const widgetData = {
    data: {
      rows: response.data.map((o) => {
        // delete old key, replace it with new
        // delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey]
        delete Object.assign(o, { planted_forest: o.planted_forest__ha })
          .planted_forest__ha;
        delete Object.assign(o, { forest_primary: o.primary_forest__ha })
          .primary_forest__ha;
        delete Object.assign(o, {
          forest_regenerated: o.regenerated_forest__ha,
        }).regenerated_forest__ha;
        delete Object.assign(o, { extent: o.fao_treecover__ha })
          .fao_treecover__ha;
        return o;
      }),
    },
  };

  return widgetData;
};

export const getFAOReforest = async ({ yearRange = '2015-2020', download }) => {
  const target = download ? 'download/csv' : 'query/json';
  const query = download
    ? NEW_SQL_QUERIES.faoReforestDownload
    : NEW_SQL_QUERIES.faoReforest;
  const url = `/dataset/fao_forest_change/v2020/${target}?sql=${query}`.replace(
    /{yearRange}/g,
    `'${yearRange}'`
  );

  if (download) {
    return {
      name: 'fao_treecover_reforestation__ha',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString(),
    };
  }

  const response = await dataRequest.get(url);

  const widgetData = {
    data: {
      rows: response.data.map((o) => {
        delete Object.assign(o, { rate: o.reforestation__rate })
          .reforestation__rate;
        delete Object.assign(o, { extent: o.fao_treecover_reforest__ha })
          .fao_treecover_reforest__ha;
        return o;
      }),
    },
  };

  return widgetData;
};

export const getFAODeforest = async ({
  adm0,
  yearRange = '2015-2020',
  download,
}) => {
  const target = download ? 'download/csv' : 'query/json';
  const url =
    `/dataset/fao_forest_change/v2020/${target}?sql=${NEW_SQL_QUERIES.faoDeforest}`
      .replace(/{yearRange}/g, `'${yearRange}'`)
      .replace(/{location}/g, adm0 ? `AND iso = '${adm0}'` : '');

  if (download) {
    return {
      name: 'fao_treecover_deforestation__ha',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString(),
    };
  }

  const response = await dataRequest.get(url);

  const widgetData = {
    data: {
      rows: response.data.map((o) => {
        delete Object.assign(o, { country: o.iso }).iso;
        delete Object.assign(o, { deforest: o.fao_treecover_deforest__ha })
          .fao_treecover_deforest__ha;
        return o;
      }),
    },
  };

  return widgetData;
};

export const getFAODeforestRank = ({ yearRange = '2015-2020', download }) => {
  const target = download ? 'download/csv' : 'query/json';
  const url =
    `/dataset/fao_forest_change/v2020/${target}?sql=${NEW_SQL_QUERIES.faoDeforestRank}`.replace(
      /{yearRange}/g,
      `'${yearRange}'`
    );

  if (download) {
    return {
      name: 'fao_treecover_deforestation_rank',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString(),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      rows: response.data.map((o) => {
        delete Object.assign(o, { deforest: o.fao_treecover_deforest__ha })
          .fao_treecover_deforest__ha;
        return o;
      }),
    },
  }));
};

export const getFAOEmployment = (params) => {
  const { adm0, adm1, adm2, download } = params || {};
  const target = download ? 'download/csv' : 'query';

  const url = `/dataset/fao_forestry_employment/v2020/${target}?sql=${NEW_SQL_QUERIES.faoEmployment}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2));

  if (download) {
    return {
      name: 'fao_forestry_employment',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString()
    };
  }

  return dataRequest.get(url).then((response) => response?.data);
};

export const getFAOEcoLive = (params) => {
  const { download } = params || {};
  const url = `/sql?q=${NEW_SQL_QUERIES.faoEcoLive}`;

  if (download) {
    return {
      name: 'fao_treecover_economic_live',
      url: `${CARTO_API}${url}&format=csv`,
    };
  }

  return cartoRequest.get(url).then((response) => ({
    ...response,
    data: {
      rows: response.data.rows.map((o) => {
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
      }),
    },
  }));
};

export const getGlobalLandCover = ({ adm0, adm1, adm2, download }) => {
  const url = `/sql?q=${NEW_SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );

  if (download) {
    return {
      name: 'global_land_cover',
      url: `${CARTO_API}${url}&format=csv`,
    };
  }

  return cartoRequest.get(url);
};

export const getUSLandCover = (params) => {
  const { adm0, adm1, adm2, startYear, endYear, download } = params;
  let admQuery = '';
  if (adm1 && !adm2) {
    // adm1
    admQuery = `AND adm1 = ${adm1}`;
  } else if (adm1 && adm2) {
    // adm 2
    admQuery = `AND adm1 = ${adm1} AND adm2 = ${adm2}`;
  }
  const url = `/sql?q=${NEW_SQL_QUERIES.getNLCDLandCover}`
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
      name: `land_cover_in_ha_in_${adm0}${adm1 ? `_${adm1}` : ''}${
        adm2 ? `_${adm2}` : ''
      }_from_${startYear}_to_${endYear}`,
      url: `${CARTO_API}${url}&format=csv`,
    };
  }

  return cartoRequest.get(url).then((response) => ({
    ...response,
    data: {
      rows: response.data.rows.map((o) => {
        delete Object.assign(o, { from_class_ipcc: o.initial_ipcc_category })
          .initial_ipcc_category;
        delete Object.assign(o, { to_class_ipcc: o.final_ipcc_category })
          .final_ipcc_category;
        delete Object.assign(o, { from_class_nlcd: o.initial_nlcd_category })
          .initial_nlcd_category;
        delete Object.assign(o, { to_class_nlcd: o.final_nlcd_category })
          .final_nlcd_category;
        return o;
      }),
    },
  }));
};
