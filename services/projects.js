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

  const countries = projectsData?.[1]?.data?.rows;
  const projects = projectsData?.[0]?.data?.map((d) => {
    const itemCountries = countries?.filter(
      (c) => d.acf.country && d.acf.country.indexOf(c.iso) > -1
    );

    return {
      id: parseInt(d.acf.id, 10),
      title: d.title.rendered,
      sector: d.acf.sector,
      summary: d.acf.short_description,
      description: d.acf.long_description,
      meta: `${d.acf.year}${
        itemCountries && ` - ${itemCountries.map((c) => c.name).join(', ')}`
      }`,
      year: d.acf.year,
      countries: d.acf.country,
      image: d.acf.images?.[0] || null,
      images: d.acf.images || null,
      blogSentence: d.acf.blog_sentence,
      blogLink: d.acf.hyperlinks_for_blog_sentence,
      latitude: d.acf.latitude_average || null,
      longitude: d.acf.longitude_average || null,
      categories: [d.acf.project_type_1, d.acf.project_type_2],
    };
  });

  return projects;
}
