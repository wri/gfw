import { cartoRequest } from 'utils/request';

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  allProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code_ = b.alpha_3_code',
  sgfProjects: 'SELECT * FROM sgf_stories',
};

export const fetchImpactProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.aboutImpacts}`;
  return cartoRequest.get(url).then((response) =>
    response?.data?.rows?.map((d) => ({
      id: d.cartodb_id,
      summary: d.outcome,
      image: d.image,
      imageCredit: d.image_credit,
      extLink: d.link,
    }))
  );
};

export const fetchAboutProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.allProjects}`;
  return cartoRequest.get(url).then((response) =>
    response?.data?.rows?.map((d) => ({
      id: d.organization,
      title: d.organization,
      description: d.story,
      latitude: d.latitude_average,
      longitude: d.longitude_average,
      link: d.link,
      category: d.use_case_type_how_to_portal_,
      sgf: d.sgf,
    }))
  );
};

export const fetchSGFProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.sgfProjects}`;
  return cartoRequest.get(url);
};
