import { cartoRequest } from 'utils/request';

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  allProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code = b.alpha_3_code',
  sgfProjects: 'SELECT * FROM sgf_stories'
};

export const fetchAboutProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.aboutImpacts}`;
  return cartoRequest.get(url);
};

export const fetchAllProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.allProjects}`;
  return cartoRequest.get(url);
};

export const fetchSGFProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.sgfProjects}`;
  return cartoRequest.get(url);
};
