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
            sector: d.sector,
            summary: d.short_description,
            description: d.long_description,
            descriptionLink: d.hyperlinks_for_long_description,
            meta: `${d.year} - ${d.country_iso_code}`,
            year: d.year,
            country: d.city,
            image: d.image,
            blogSentence: d.blog_sentence,
            blogLink: d.hyperlinks_for_blog_sentence,
            latitude: d.latitude_average,
            longitude: d.longitude_average,
            categories: [d.project_type_1, d.project_type_2]
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
