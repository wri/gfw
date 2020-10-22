import groupBy from 'lodash/groupBy';

import PageWrapper from 'layouts/wrappers/page';
import About from 'layouts/about';

import { fetchAboutProjects, fetchImpactProjects } from 'services/projects';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const projects = await fetchAboutProjects();
  const groupedProjects = groupBy(projects, 'category');
  const categories = [
    { label: 'All', count: projects.length },
    ...Object.keys(groupedProjects).map((c) => ({
      label: c,
      count: groupedProjects[c].length,
    })),
  ];
  const projectsByCategory = {
    ...groupedProjects,
    All: projects,
  };

  const impactProjects = await fetchImpactProjects();

  return {
    props: {
      projects,
      categories,
      projectsByCategory,
      impactProjects,
    },
  };
};

export default AboutPage;
