import { mapboxRequest, cartoRequest } from 'utils/request';
import compact from 'lodash/compact';
import { all, spread } from 'axios';

const getSearchSQL = (string, nameString, nameStringSimple) => {
  const words = string && string.split(/,| |, /);
  if (words && words.length) {
    const mappedWords = compact(words.map((w) => (w ? `%25${w}%25` : '')));
    const whereQueries = mappedWords.map(
      (w) =>
        `LOWER(${nameString}) LIKE '${w}' OR LOWER(${nameStringSimple}) LIKE '${w}' OR LOWER(name_1) LIKE '${w}' OR LOWER(simple_name_1) LIKE '${w}' OR LOWER(name_2) LIKE '${w}' OR LOWER(simple_name_2) LIKE '${w}'`
    );

    return whereQueries.join(' OR ');
  }

  return null;
};

const getWhereStatement = (search, nameString, nameStringSimple) => {
  const searchLower = search && search.toLowerCase();

  return getSearchSQL(searchLower, nameString, nameStringSimple);
};

export const fetchGeocodeLocations = (
  searchQuery = '',
  lang = 'en',
  cancelToken
) => {
  let nameString = 'name_0';
  let nameStringSimple = 'simple_name_0';
  if (lang !== 'en') nameString = `name_${lang.toLowerCase()}`;
  if (lang !== 'en') nameStringSimple = nameString;
  const whereStatement = getWhereStatement(
    searchQuery,
    nameString,
    nameStringSimple
  );

  return all([
    mapboxRequest
      .get(
        `/geocoding/v5/mapbox.places/${searchQuery}.json?language=${lang}&access_token=${process.env.MapboxAccessToken}&types=postcode,district,place,locality,neighborhood,address,poi`,
        {
          cancelToken,
        }
      )
      .catch(() => {}),
    cartoRequest
      .get(
        `/sql?q=SELECT cartodb_id, area, size, level, name_0, name_1, name_2, gid_0, gid_1, gid_2, CASE WHEN gid_2 is not null THEN CONCAT(name_2, ', ', name_1, ', ', ${nameString}) WHEN gid_1 is not null THEN CONCAT(name_1, ', ', ${nameString}) WHEN gid_0 is not null THEN ${nameString} END AS place_name FROM gadm36_political_boundaries WHERE ${whereStatement} AND gid_0 != 'TWN' AND gid_0 != 'XCA' ORDER BY level, place_name LIMIT 5`,
        {
          cancelToken,
        }
      )
      .catch(() => {}),
  ]).then(spread((mapboxResponse) => mapboxResponse?.data?.features));
};
