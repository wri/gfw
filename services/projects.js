import { cartoRequest } from 'utils/request';
import apiFetch from '@wordpress/api-fetch';
import axios from 'axios';

import { getCountriesProvider } from 'services/country';

const SQL_QUERIES = {
  impactProjects: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  sgfProjects: 'SELECT * FROM sgf_stories',
};

export const getImpactProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.impactProjects}`;
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

apiFetch.setFetchHandler(async (options) => {
  const headers = { 'Content-Type': 'application/json' };

  const { url, path, data, method, params } = options;

  return axios({
    headers,
    url: url || path,
    method,
    data,
    params,
  });
});

const formatProjects = (projectsData) => {
  const countries = projectsData?.[1]?.data?.rows;
  const projects = projectsData?.[0]?.data;

  if (!projects) {
    return {};
  }

  return projects.map((project) => {
    const { title, acf: advancedCustomFields } = project;
    const itemCountries = countries.filter(
      (country) =>
        advancedCustomFields.country &&
        advancedCustomFields.country.indexOf(country.iso) > -1
    );

    return {
      id: parseInt(advancedCustomFields.id, 10),
      title: title.rendered,
      sector: advancedCustomFields.sector,
      summary: advancedCustomFields.short_description,
      description: advancedCustomFields.long_description,
      meta: `${advancedCustomFields.year}${
        itemCountries &&
        ` - ${itemCountries.map((country) => country.name).join(', ')}`
      }`,
      year: advancedCustomFields.year,
      countries: advancedCustomFields.country,
      image: advancedCustomFields.images?.[0] || null,
      images: advancedCustomFields.images || null,
      blogSentence: advancedCustomFields.blog_sentence,
      blogLink: advancedCustomFields.hyperlinks_for_blog_sentence,
      latitude: advancedCustomFields.latitude_average || null,
      longitude: advancedCustomFields.longitude_average || null,
      categories: [
        advancedCustomFields.project_type_1,
        advancedCustomFields.project_type_2,
      ],
    };
  });
};

export async function getSGFProjects({
  cancelToken,
  params,
  allLanguages,
} = {}) {
  const projectsData = await Promise.all([
    apiFetch({
      url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp/v2/gaf_projects?per_page=21`,
      params: {
        ...params,
        _embed: true,
        ...(!allLanguages && {
          lang: 'en',
        }),
      },
      cancelToken,
    }),
    getCountriesProvider(),
  ]);

  const formattedProjects = formatProjects(projectsData);

  return formattedProjects;
}
