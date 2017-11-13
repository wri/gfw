import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

export const fetchProjectsInit = createAction('fetchProjectsInit');
export const fetchProjectsReady = createAction('fetchProjectsReady');
export const fetchProjectsFail = createAction('fetchProjectsFail');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => dispatch => {
    dispatch(fetchProjectsInit());
    fetch(
      'http://wri-01.carto.com/api/v2/sql?q=SELECT%20a.*%2C%20b.latitude_average%2C%20b.longitude_average%20FROM%20gfw_use_cases_for_about_page%20a%2C%20country_list_iso_3166_codes_latitude_longitude%20b%20WHERE%20a.country_iso_code%20%3D%20b.alpha_3_code'
    )
      .then(response => {
        if (response.ok) return response.json();
        throw Error(response.statusText);
      })
      .then(data => {
        dispatch(fetchProjectsReady(data.rows));
      })
      .catch(error => {
        console.warn(error);
        dispatch(fetchProjectsFail());
      });
  }
);
