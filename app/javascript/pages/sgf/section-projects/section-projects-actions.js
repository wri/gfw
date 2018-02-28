import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchSGFProjects } from 'services/projects';

export const setProjectsLoading = createAction('setProjectsLoading');
export const setProjectsData = createAction('setProjectsData');
export const setCategorySelected = createAction('setCategorySelected');
export const setSearch = createAction('setSearch');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => (dispatch, getState) => {
    if (!getState().projects.loading) {
      dispatch(setProjectsLoading({ loading: true, error: false }));
      fetchSGFProjects()
        .then(data => {
          const { rows } = data.data;
          const dataParsed = rows.map(d => ({
            id: d.cartodb_id,
            title: d.organization,
            outcome: d.story,
            city: d.city,
            image:
              d.image ||
              'https://image.ibb.co/hDJdDR/african_wildlife_foundation.jpg',
            image_credit: d.image_credit,
            blog_link: d.link,
            latitude: d.latitude_average,
            longitude: d.longitude_average,
            legend: `${d.year.toString()} - ${d.city}`,
            category: d.use_case_type_how_to_portal
          }));
          dispatch(setProjectsData(dataParsed));
        })
        .catch(error => {
          console.error(error);
          dispatch(setProjectsLoading({ loading: false, error: true }));
        });
    }
  }
);
