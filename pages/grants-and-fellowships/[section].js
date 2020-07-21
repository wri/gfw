import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import capitalize from 'lodash/capitalize';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import Layout from 'layouts/page';
import GrantsAndFellowships from 'pages/sgf';
import SgfUrlProvider from 'providers/sgf-url-provider';

import { setSectionProjectsModalSlug } from 'pages/sgf/section-projects/section-projects-modal/actions';

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

const GrantsAndFellowshipsPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { sgfModal } = decodeParamsForState(query) || {};

    if (sgfModal) {
      dispatch(setSectionProjectsModalSlug(sgfModal));
    }
  }, [fullPathname]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <Layout {...props} {...pageProps}>
      <SgfUrlProvider />
      {ready && <GrantsAndFellowships />}
    </Layout>
  );
};

export default GrantsAndFellowshipsPage;
