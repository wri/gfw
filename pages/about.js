import PageWrapper from 'wrappers/page';
import About from 'layouts/about';

import PropTypes from 'prop-types';

import { getSGFProjects } from 'services/projects';
import { getCountriesProvider } from 'services/country';
import { getImpactProjects } from 'services/impact-projects';

import { getPublishedNotifications } from 'services/notifications';

const AboutPage = (props) => (
  <PageWrapper
    title="About GFW | Global Forest Watch"
    description="Global Forest Watch is an online platform that provides data and tools for monitoring forests."
    notifications={props.notifications}
  >
    <About {...props} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const { sgfProjects } = await getSGFProjects({ params: { per_page: 100 } });
  const getProjects = await getImpactProjects();

  const impactProjects = getProjects?.map((d) => ({
    summary: d.acf.outcome,
    image: d.acf.image,
    imageCredit: d.acf.image_credit,
    extLink: d.acf.link,
  }));

  const countries = await getCountriesProvider();
  const notifications = await getPublishedNotifications();

  return {
    props: {
      impactProjects,
      sgfProjects,
      countries: countries?.data,
      notifications: notifications || [],
    },
    revalidate: 10,
  };
};

AboutPage.propTypes = {
  notifications: PropTypes.array,
};

export default AboutPage;
