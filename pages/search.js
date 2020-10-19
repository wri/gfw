import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useRouter from 'utils/router';

import PageWrapper from 'wrappers/page';
import Search from 'pages/search';
import SearchUrlProvider from 'providers/search-url-provider';

import { setSearchQuery } from 'layouts/search/actions';

const SearchPage = () => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { query: searchQuery } = query || {};
    if (searchQuery) {
      dispatch(setSearchQuery(searchQuery));
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
    <PageWrapper
      title="Search | Global Forest Watch"
      description="Search forest information, including forest data, news, updates and more."
      noIndex
    >
      {ready && (
        <>
          <Search />
          <SearchUrlProvider />
        </>
      )}
    </PageWrapper>
  );
};

export default SearchPage;
