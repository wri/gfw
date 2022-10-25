import capitalize from 'lodash/capitalize';

import PageLayout from 'wrappers/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

import { getSGFProjects } from 'services/projects';

const SECTIONS = ['projects', 'about', 'apply'];

const GrantsAndFellowshipsPage = (props) => (
  <PageLayout
    {...props}
    description="The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work."
  >
    <GrantsAndFellowships {...props} />
  </PageLayout>
);

export const getStaticPaths = async () => {
  const paths = SECTIONS.map((key) => ({
    params: { section: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  if (params?.section === 'projects') {
    const projects = await getSGFProjects();

    return {
      props: {
        title: 'Projects | Grants & Fellowships | Global Forest Watch',
        section: params?.section,
        projects: projects || [],
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

export default GrantsAndFellowshipsPage;
