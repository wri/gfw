import groupBy from 'lodash/groupBy';

import PageWrapper from 'layouts/page';
import About from 'pages/about';

import { fetchAllProjects, fetchAboutProjects } from 'services/projects';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const projectsResponse = await fetchAllProjects();
  const projects = projectsResponse?.data?.rows?.map((d) => ({
    id: d.organization,
    title: d.organization,
    description: d.story,
    latitude: d.latitude_average,
    longitude: d.longitude_average,
    link: d.link,
    category: d.use_case_type_how_to_portal_,
    sgf: d.sgf,
  }));

  const projectsByCategory = groupBy(projects, 'category');

  const categories = [
    { label: 'All', count: projects.length },
    ...Object.keys(projectsByCategory).map((c) => ({
      label: c,
      count: projectsByCategory[c].length,
    })),
  ];

  const impactProjectsResponse = await fetchAboutProjects();
  const impactProjects = impactProjectsResponse?.data?.rows?.map((d) => ({
    id: d.cartodb_id,
    summary: d.outcome,
    image: d.image,
    imageCredit: d.image_credit,
    extLink: d.link,
  }));

  return {
    props: {
      projects,
      categories,
      projectsByCategory: {
        ...projectsByCategory,
        All: projects,
      },
      impactProjects,
    },
  };
};

export default AboutPage;
