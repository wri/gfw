import capitalize from 'lodash/capitalize';
import ReactHtmlParser from 'react-html-parser';

import PageLayout from 'wrappers/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

import { getSGFPage } from 'services/grants-and-fellowships';
import { getSGFProjects, getSGFCountries } from 'services/projects';

import { getCountriesProvider } from 'services/country';
import { getPublishedNotifications } from 'services/notifications';

const SECTIONS = ['projects', 'about', 'apply'];

const GrantsAndFellowshipsPage = (props) => (
  <PageLayout
    {...props}
    description="The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work."
  >
    <GrantsAndFellowships {...props} />
  </PageLayout>
);

export const getServerSideProps = async ({ query }) => {
  if (!SECTIONS.includes(query?.section)) {
    return {
      notFound: true,
    };
  }

  const notifications = await getPublishedNotifications({});

  if (query?.section === 'projects') {
    const pageTexts = await getSGFPage();
    const { sgfProjects, totalPages } = await getSGFProjects({
      params: { per_page: 21 },
    });
    const allCountries = await getCountriesProvider();
    const countriesArray = await getSGFCountries();

    const countriesIso = countriesArray.data.map((item) => item.acf.country);

    const flattenCountries = countriesIso
      .map((isoItem) =>
        isoItem.split(',').map((splittedItem) => splittedItem.trim())
      )
      .reduce((acc, curr) => acc.concat(curr), []);

    const uniqCountries = [...new Set(flattenCountries)];

    const parsedProjects = sgfProjects.map((project) => ({
      ...project,
      title: ReactHtmlParser(project.title),
    }));

    return {
      props: {
        title: 'Projects | Grants & Fellowships | Global Forest Watch',
        section: query?.section,
        projects: parsedProjects || [],
        allCountries: allCountries?.data?.rows || [],
        projectCountries: uniqCountries || [],
        country: query?.country || '',
        projectsTexts: pageTexts?.[0]?.acf,
        header: pageTexts[0],
        totalPages,
        notifications: notifications || [],
      },
    };
  }

  if (query?.section === 'about') {
    const pageTexts = await getSGFPage();
    return {
      props: {
        title: 'About | Grants & Fellowships | Global Forest Watch',
        section: query?.section,
        about: pageTexts?.[0]?.acf?.about_section,
        header: pageTexts[0],
        notifications: notifications || [],
      },
    };
  }

  if (query?.section === 'apply') {
    const pageTexts = await getSGFPage();
    return {
      props: {
        title: 'Apply | Grants & Fellowships | Global Forest Watch',
        section: query?.section,
        apply: pageTexts?.[0]?.acf?.apply_section,
        header: pageTexts[0],
        notifications: notifications || [],
      },
    };
  }

  return {
    props: {
      title: `${capitalize(
        query?.section
      )} | Grants & Fellowships | Global Forest Watch`,
      section: query?.section,
      notifications: notifications || [],
    },
  };
};

export default GrantsAndFellowshipsPage;
