import { cartoRequest } from 'utils/request';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';

import { getCountriesProvider } from 'services/country';
import { getBucketObjects, getImageUrl } from 'services/aws';

const SQL_QUERIES = {
  useCaseProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code_ = b.alpha_3_code',
  impactProjects: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  sgfProjects: 'SELECT * FROM sgf_stories',
};

export const getUseCaseProjects = () => {
  const url = `/sql?q=${SQL_QUERIES.useCaseProjects}`;
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

export const getSGFProjects = async () => {
  const projectsData = await Promise.all([
    cartoRequest.get(`/sql?q=${SQL_QUERIES.sgfProjects}`),
    getCountriesProvider(),
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
          return groupBy(bucketContents, 'folder');
        }

        return false;
      },
      'SGF page/'
    ),
  ]);

  const countries = projectsData?.[1]?.data?.rows;
  const projects = projectsData?.[0]?.data?.rows?.map((d) => {
    const imagesPath = d.image.split('>');
    const itemCountries = countries?.filter(
      (c) => d.country_iso_code_ && d.country_iso_code_.indexOf(c.iso) > -1
    );

    return {
      id: d.cartodb_id,
      title: d.organization,
      sector: d.sector,
      summary: d.short_description,
      description: d.long_description,
      meta: `${d.year}${
        itemCountries && ` - ${itemCountries.map((c) => c.name).join(', ')}`
      }`,
      year: d.year,
      countries: d.country_iso_code_,
      imageKey: imagesPath[3],
      blogSentence: d.blog_sentence,
      blogLink: d.hyperlinks_for_blog_sentence,
      latitude: d.latitude_average || null,
      longitude: d.longitude_average || null,
      categories: [d.project_type_1, d.project_type_2],
    };
  });

  const imageResponse = projectsData?.[2]?.response?.data?.Contents;
  const images =
    imageResponse &&
    (await Promise.all(
      imageResponse?.map((b) => {
        if (b.Key.slice(-1) !== '/' && b.Key.toLowerCase().includes('.jpg')) {
          const urlParams = { Bucket: 'gfw.blog', Key: b.Key };
          const imageUrl = getImageUrl(urlParams);

          return {
            key: b.Key,
            folder: b.Key.split('/')[1],
            url: imageUrl?.split('?')?.[0],
          };
        }

        return false;
      })
    ));

  const imagesDictionary = groupBy(compact(images || []), 'folder');
  return projects.map((p) => {
    const imagesArray = imagesDictionary?.[p?.imageKey]?.map((i) => i?.url);

    return {
      ...p,
      image: imagesArray?.[0] || null,
      images: imagesArray || null,
    };
  });
};
