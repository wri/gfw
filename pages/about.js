import PageWrapper from 'wrappers/page';
import About from 'layouts/about';

import { getImpactProjects, getSGFProjects } from 'services/projects';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const sgfProjects = await getSGFProjects();
  const impactProjects = await getImpactProjects();

  return {
    props: {
      impactProjects,
      sgfProjects,
    },
  };
};

export default AboutPage;
