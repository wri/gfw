import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  allProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code = b.alpha_3_code',
  sgfProjects:
    'SELECT%20a.*%2C%20b.latitude_average%2C%20b.longitude_average%20FROM%20sgf_stories%20a%2C%20country_list_iso_3166_codes_latitude_longitude%20b%20WHERE%20a.country_iso_code%20%3D%20b.alpha_3_code'
};

export const fetchAboutProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.aboutImpacts}`;
  return axios.get(url);
};

export const fetchAllProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.allProjects}`;
  return axios.get(url);
};

export const fetchSGFProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.sgfProjects}`;
  return axios.get(url);
};
