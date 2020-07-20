import capitalize from 'lodash/capitalize';

import Layout from 'app/layouts/root';
import GrantsAndFellowships from 'pages/sgf';

const pageProps = {
  description:
    'The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work.',
  keywords:
    'forests, forest data, data, technology, forest monitoring, forest policy, advocacy, education, fellow, fellowship, grants, civil society, land rights, conservation, field work, local, deforestation, community, research',
};

const sections = ['projects', 'about', 'apply'];

export const getStaticPaths = async () => {
  const paths = sections.map((key) => ({
    params: { section: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => ({
  props: {
    title: `${capitalize(
      params?.section
    )} | Grants & Fellowships | Global Forest Watch`,
  },
});

const GrantsAndFellowshipsPage = (props) => (
  <Layout {...props} {...pageProps}>
    <GrantsAndFellowships />
  </Layout>
);

export default GrantsAndFellowshipsPage;
