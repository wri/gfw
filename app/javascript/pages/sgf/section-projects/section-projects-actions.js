import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

export const fetchProjectsInit = createAction('fetchProjectsInit');
export const fetchProjectsReady = createAction('fetchProjectsReady');
export const fetchProjectsFail = createAction('fetchProjectsFail');

export const setCategorySelected = createAction('setCategorySelected');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => (dispatch, getState) => {
    const { data: projectData } = getState().projects;
    if (!projectData || !projectData.length) {
      dispatch(fetchProjectsInit());
      fetch(
        'http://wri-01.carto.com/api/v2/sql?q=SELECT%20a.*%2C%20b.latitude_average%2C%20b.longitude_average%20FROM%20gfw_use_cases_for_about_page%20a%2C%20country_list_iso_3166_codes_latitude_longitude%20b%20WHERE%20a.country_iso_code%20%3D%20b.alpha_3_code%20AND%20sgf=true'
      )
        .then(response => {
          if (response.ok) return response.json();
          throw Error(response.statusText);
        })
        .then(data => {
          const dataParsed = (data.rows || []).map(d => ({
            id: d.cartodb_id,
            title: d.organization,
            outcome: d.story,
            city: d.city,
            // TODO: remove this when having real images
            image:
              d.image ||
              'https://image.ibb.co/hDJdDR/african_wildlife_foundation.jpg',
            image_credit: d.image_credit,
            link: d.link,
            latitude: d.latitude_average,
            longitude: d.longitude_average,
            legend: d.year.toString(),
            category: d.use_case_type_how_to_portal
          }));
          dispatch(fetchProjectsReady(dataParsed));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchProjectsFail());
        });
    }
  }
);
