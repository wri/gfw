import capitalize from 'lodash/capitalize';

import PageLayout from 'wrappers/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

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
    const projects = await getSGFProjects();
    const countries = await getCountriesProvider();

    return {
      props: {
        title: 'Projects | Grants & Fellowships | Global Forest Watch',
        section: query?.section,
        projects: projects || [],
        countries: countries?.data?.rows || [],
        country: query?.country || '',
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
