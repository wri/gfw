import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import Layout from 'wrappers/page';
import GrantsAndFellowships from 'pages/sgf';
import SgfUrlProvider from 'providers/sgf-url-provider';

import { setSectionProjectsModalSlug } from 'pages/sgf/section-projects/section-projects-modal/actions';

import { fetchSGFProjects } from 'services/projects';
import { getCountriesProvider, getCountriesLatLng } from 'services/country';
import { getBucketObjects, getImageUrl } from 'services/aws';

const pageProps = {
  description:
    'The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work.',
};

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
          return {
            key: b.Key,
            folder: b.Key.split('/')[1],
            url: getImageUrl(urlParams),
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
        countries: countries || [],
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

const GrantsAndFellowshipsPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { sgfModal } = decodeParamsForState(query) || {};

    if (sgfModal) {
      dispatch(setSectionProjectsModalSlug(sgfModal));
    }
  }, [fullPathname]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <Layout {...props} {...pageProps}>
      {ready && (
        <>
          <SgfUrlProvider />
          <GrantsAndFellowships {...props} />
        </>
      )}
    </Layout>
  );
};

export default GrantsAndFellowshipsPage;
