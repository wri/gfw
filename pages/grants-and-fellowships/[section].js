import capitalize from 'lodash/capitalize';
import ReactHtmlParser from 'react-html-parser';

import PageLayout from 'wrappers/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

import { getSGFPage } from 'services/grants-and-fellowships';
import { getSGFProjects } from 'services/projects';
import { getCountriesProvider } from 'services/country';

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

  if (query?.section === 'projects') {
    const pageTexts = await getSGFPage();
    const { sgfProjects, totalPages } = await getSGFProjects();
    const countries = await getCountriesProvider();

    const parsedProjects = sgfProjects.map((p) => ({
      ...p,
      title: ReactHtmlParser(p.title),
    }));

    return {
      props: {
        title: 'Projects | Grants & Fellowships | Global Forest Watch',
        section: query?.section,
        projects: parsedProjects || [],
        countries: countries?.data?.rows || [],
        country: query?.country || '',
        projectsTexts: pageTexts?.[0]?.acf,
        header: pageTexts[0],
        totalPages,
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
      },
    };
  }

  return {
    props: {
      title: `${capitalize(
        query?.section
      )} | Grants & Fellowships | Global Forest Watch`,
      section: query?.section,
    },
  };
};

export default GrantsAndFellowshipsPage;
