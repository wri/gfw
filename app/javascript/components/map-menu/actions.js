import { createAction, createThunkAction } from 'utils/redux';
import request from 'utils/request';
import compact from 'lodash/compact';
import { parseGadm36Id } from 'utils/format';
import useRouter from 'app/router';

import { setMapSettings } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';
import { setAnalysisSettings } from 'components/analysis/actions';

import { CARTO_API } from 'utils/constants';

export const setLocationsData = createAction('setLocationsData');
export const setMenuLoading = createAction('setMenuLoading');
export const setMenuSettings = createAction('setMenuSettings');

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

export const getLocationFromSearch = createThunkAction(
  'getLocationFromSearch',
  ({ search, token, lang }) => (dispatch) => {
    dispatch(setMenuLoading(true));
    if (search) {
      const searchLower = search && search.toLowerCase();
      let nameString = 'name_0';
      let nameStringSimple = 'simple_name_0';
      if (lang !== 'en') nameString = `name_${lang.toLowerCase()}`;
      if (lang !== 'en') nameStringSimple = nameString;
      const whereStatement = getSearchSQL(
        searchLower,
        nameString,
        nameStringSimple
      );

      if (whereStatement) {
        request
          .get(
            `${CARTO_API}/sql?q=SELECT gid_0, gid_1, gid_2, CASE WHEN gid_2 is not null THEN CONCAT(name_2, ', ', name_1, ', ', ${nameString}) WHEN gid_1 is not null THEN CONCAT(name_1, ', ', ${nameString}) WHEN gid_0 is not null THEN ${nameString} END AS label FROM gadm36_political_boundaries WHERE ${whereStatement} AND gid_0 != 'TWN' AND gid_0 != 'XCA' ORDER BY level, label`,
            {
              cancelToken: token,
            }
          )
          .then((response) => {
            if (response.data.rows && response.data.rows.length) {
              dispatch(setLocationsData(response.data.rows));
            } else {
              dispatch(setLocationsData([]));
            }
            dispatch(setMenuLoading(false));
          })
          .catch(() => {
            dispatch(setMenuLoading(false));
          });
      }
    }
  }
);

export const handleClickLocation = createThunkAction(
  'handleClickLocation',
  ({ gid_0: gid0, gid_1: gid1, gid_2: gid2 }) => (dispatch) => {
    const newLocation = parseGadm36Id(gid2 || gid1 || gid0);
    const { query, pathname, pushDynamic } = useRouter();

    dispatch(setMapSettings({ canBound: true }));
    dispatch(setMenuSettings({ menuSection: '' }));
    dispatch(setMainMapSettings({ showAnalysis: true }));

    pushDynamic({
      pathname,
      query: {
        ...query,
        location: compact([
          'country',
          newLocation.adm0,
          newLocation.adm1,
          newLocation.adm2,
        ]).join('/'),
      },
    });
  }
);

export const handleViewOnMap = createThunkAction(
  'handleViewOnMap',
  ({ analysis, map }) => (dispatch) => {
    if (map) {
      dispatch(setMapSettings(map));
    }
    dispatch(setMenuSettings({ menuSection: '' }));
    if (analysis) {
      dispatch(setAnalysisSettings(analysis));
    }
  }
);

export const showAnalysis = createThunkAction(
  'showAnalysis',
  () => (dispatch) => {
    dispatch(setMenuSettings({ menuSection: 'analysis' }));
  }
);
