import { createAction, createThunkAction } from 'redux-tools';

import { fetchAboutProjects } from 'services/projects';

export const setImpactsProjectsLoading = createAction(
  'setImpactsProjectsLoading'
);
export const setImpactsProjectsData = createAction('setImpactsProjectsData');

export const fetchImpactProjects = createThunkAction(
  'fetchImpactProjects',
  () => (dispatch, getState) => {
    const { impacts } = getState();
    if (impacts && !impacts.loading) {
      dispatch(setImpactsProjectsLoading({ loading: true, error: false }));
      fetchAboutProjects()
        .then(data => {
          const { rows } = data.data;
          const dataParsed = rows.map(d => ({
            id: d.cartodb_id,
            title: d.organization,
            summary: d.outcome,
            meta: d.city,
            image: d.image,
            imageCredit: d.image_credit,
            extLink: d.link
          }));
          dispatch(setImpactsProjectsData(dataParsed));
        })
        .catch(error => {
          console.error(error);
          dispatch(setImpactsProjectsLoading({ loading: false, error: true }));
        });
    }
  }
);
