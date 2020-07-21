import { all, spread } from 'axios';
import { createAction, createThunkAction } from 'utils/redux';
import groupBy from 'lodash/groupBy';

import { fetchSGFProjects } from 'services/projects';
import { getCountriesProvider, getCountriesLatLng } from 'services/country';
import { getBucketObjects, getImageUrl } from 'services/aws';

export const setProjectsLoading = createAction('setProjectsLoading');
export const setProjectsData = createAction('setProjectsData');
export const setCategorySelected = createAction('setCategorySelected');
export const setCustomFilter = createAction('setCustomFilter');
export const setSearch = createAction('setSearch');

export const fetchProjects = createThunkAction(
  'fetchProjects',
  () => (dispatch) => {
    dispatch(setProjectsLoading({ loading: true, error: false }));
    all([fetchSGFProjects(), getCountriesProvider(), getCountriesLatLng()])
      .then(
        spread((data, countries, latLngs) => {
          const { rows } = data.data;
          const dataParsed = rows.map((d) => {
            const imagesPath = d.image.split('>');
            const itemCountries =
              countries.data &&
              countries.data.rows.filter(
                (c) =>
                  d.country_iso_code_ && d.country_iso_code_.indexOf(c.iso) > -1
              );

            return {
              id: d.cartodb_id,
              title: d.organization,
              sector: d.sector,
              summary: d.short_description,
              description: d.long_description,
              meta: `${d.year}${
                itemCountries &&
                ` - ${itemCountries.map((c) => c.name).join(', ')}`
              }`,
              year: d.year,
              countries: d.country_iso_code_,
              imageKey: imagesPath[3],
              blogSentence: d.blog_sentence,
              blogLink: d.hyperlinks_for_blog_sentence,
              latitude: d.latitude_average,
              longitude: d.longitude_average,
              categories: [d.project_type_1, d.project_type_2],
            };
          });
          dispatch(
            setProjectsData({
              projects: dataParsed,
              latLngs: latLngs.data.rows,
            })
          );
        })
      )
      .catch(() => {
        dispatch(setProjectsLoading({ loading: false, error: true }));
      });
  }
);

export const fetchProjectsImages = createThunkAction(
  'fetchProjectsImages',
  () => (dispatch) => {
    getBucketObjects(
      'gfw.blog',
      (err, imageData) => {
        if (!err) {
          const bucketContents = [];
          imageData.Contents.forEach((b) => {
            if (
              b.Key.slice(-1) !== '/' &&
              b.Key.toLowerCase().includes('.jpg')
            ) {
              const urlParams = { Bucket: 'gfw.blog', Key: b.Key };
              bucketContents.push({
                key: b.Key,
                folder: b.Key.split('/')[1],
                url: getImageUrl(urlParams),
              });
            }
          });
          const imagesByKey = groupBy(bucketContents, 'folder');
          dispatch(
            setProjectsData({
              images: imagesByKey,
            })
          );
        }
      },
      'SGF page/'
    );
  }
);
