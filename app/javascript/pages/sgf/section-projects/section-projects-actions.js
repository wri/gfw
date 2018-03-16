import axios from 'axios';
import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { fetchSGFProjects } from 'services/projects';
import { getCountriesProvider, getCountriesLatLng } from 'services/country';
// import { getBucketObjects } from 'services/aws';

export const setProjectsLoading = createAction('setProjectsLoading');
export const setProjectsData = createAction('setProjectsData');
export const setCategorySelected = createAction('setCategorySelected');
export const setSearch = createAction('setSearch');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => (dispatch, getState) => {
    if (!getState().projects.loading) {
      dispatch(setProjectsLoading({ loading: true, error: false }));
      axios
        .all([fetchSGFProjects(), getCountriesProvider(), getCountriesLatLng()])
        .then(
          axios.spread((data, countries, latLngs) => {
            const { rows } = data.data;
            // const images = getBucketObjects('2014 - Amazon Conservation Association');
            const dataParsed = rows.map(d => {
              const imagesPath = d.image.split('>');
              const itemCountries =
                countries.data &&
                countries.data.rows.filter(
                  c => d.country_iso_code.indexOf(c.iso) > -1
                );
              return {
                id: d.cartodb_id,
                title: d.organization,
                sector: d.sector,
                summary: d.short_description,
                description: d.long_description,
                meta: `${d.year}${itemCountries &&
                  ` - ${itemCountries.map(c => c.name).join(', ')}`}`,
                year: d.year,
                countries: d.country_iso_code,
                image: `https://${
                  imagesPath[1]
                }.s3.amazonaws.com/${imagesPath.slice(2).join('/')}`,
                blogSentence: d.blog_sentence,
                blogLink: d.hyperlinks_for_blog_sentence,
                latitude: d.latitude_average,
                longitude: d.longitude_average,
                categories: [d.project_type_1, d.project_type_2]
              };
            });
            dispatch(
              setProjectsData({
                projects: dataParsed,
                latLngs: latLngs.data.rows
              })
            );
          })
        )
        .catch(error => {
          console.error(error);
          dispatch(setProjectsLoading({ loading: false, error: true }));
        });
    }
  }
);
