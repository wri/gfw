import groupBy from 'lodash/groupBy';

import PageWrapper from 'layouts/wrappers/page';
import About from 'layouts/about';

import { getUseCaseProjects, getImpactProjects } from 'services/projects';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const projects = await getUseCaseProjects();
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

  const impactProjects = await getImpactProjects();

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
