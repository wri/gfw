import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';

import Layout from 'layouts/page';
import Search from 'pages/search';
import SearchUrlProvider from 'providers/search-url-provider';

import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { setProfileModalOpen } from 'components/modals/profile/actions';

import { decodeParamsForState } from 'utils/stateToUrl';

const SearchPage = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { areaOfInterestModal, profile } = decodeParamsForState(query) || {};
    if (areaOfInterestModal) {
      dispatch(setAreaOfInterestModalSettings(areaOfInterestModal));
    }

    if (profile) {
      dispatch(setProfileModalOpen(profile));
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
    <Layout
      title="Search"
      description="Search forest information, including forest data, news, updates and more."
      keywords="GFW, forests, forest data, data, forest news, forest alerts, conservation, forest updates, forest watch, deforestation, deforesting, tree cover loss, forest loss"
    >
      <SearchUrlProvider />
      {ready && <Search />}
    </Layout>
  );
};

export default SearchPage;
