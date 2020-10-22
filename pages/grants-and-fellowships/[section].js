import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';

import PageLayout from 'layouts/wrappers/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

import { fetchSGFProjects } from 'services/projects';
import { getCountriesProvider, getCountriesLatLng } from 'services/country';
import { getBucketObjects, getImageUrl } from 'services/aws';

const sections = ['projects', 'about', 'apply'];

export const getStaticPaths = async () => {
  const paths = sections.map((key) => ({
    params: { section: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  if (params?.section === 'projects') {
    const projectsData = await Promise.all([
      fetchSGFProjects(),
      getCountriesProvider(),
      getCountriesLatLng(),
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
    const latLngs = projectsData?.[2]?.data?.rows;
    const imageResponse = projectsData?.[3]?.response?.data?.Contents;
    const images = await Promise.all(
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
    );

    return {
      props: {
        title: 'Projects | Grants & Fellowships | Global Forest Watch',
        section: params?.section,
        projects: projects || [],
        latLngs: latLngs || [],
        images: groupBy(compact(images), 'folder') || [],
      },
    };
  }

  return {
    props: {
      title: `${capitalize(
        params?.section
      )} | Grants & Fellowships | Global Forest Watch`,
      section: params?.section,
    },
  };
};

const GrantsAndFellowshipsPage = (props) => (
  <PageLayout
    {...props}
    description="The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work."
  >
    <GrantsAndFellowships {...props} />
  </PageLayout>
);

export default GrantsAndFellowshipsPage;
