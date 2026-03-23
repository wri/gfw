import { dataRequest } from 'utils/request';
import { PROXIES } from 'utils/proxies';

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

  const url =
    `/dataset/fao_forestry_employment/v2020/${target}?sql=${NEW_SQL_QUERIES.faoEmployment}`.replace(
      '{location}',
      getLocationQuery(adm0, adm1, adm2)
    );

  if (download) {
    return {
      name: 'fao_forestry_employment',
      url: new URL(
        `${window.location.origin}${PROXIES.DATA_API}${url}`
      ).toString(),
    };
  }

  return dataRequest.get(url).then((response) => response?.data);
};
