import PageWrapper from 'wrappers/page';
import About from 'layouts/about';

import { getImpactProjects } from 'services/projects';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const impactProjects = await getImpactProjects();

  return {
    props: {
      impactProjects,
    },
  };
};

export default AboutPage;
